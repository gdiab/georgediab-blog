---
title: "I Tried Entire CLI for AI Code Attribution: What Engineering Teams Should Know"
description: "A practical look at Entire CLI’s commit-level AI attribution, what it captures well, and what’s still missing for real engineering governance."
pubDatetime: 2026-02-28T08:00:00-08:00
tags:
  - ai
  - developer-tools
  - engineering-management
  - governance
  - productivity
---

<!-- P01 -->
Late last week, I shipped a feature that touched 8 files across the codebase. The attribution data captured by the Entire CLI told a clear story.

## What Entire CLI actually does

<!-- P02 -->
[Entire CLI](https://github.com/entireio/cli) hooks into your git workflow and AI coding agent (Claude Code or Gemini CLI) to capture session data: transcripts, file modifications, timestamps, and reasoning.

<!-- P03 -->
It attaches that context to your commits without polluting your main git history. Session data lives on a separate `entire/checkpoints/v1` branch.


```json
{
  "agent_lines": 357,
  "human_added": 101,
  "agent_percentage": 77.95,
  "total_committed": 458,
  "files_touched": 8
}
```

<!-- P05 -->
357 lines of AI-generated code across 8 files. 78% of the commit. Full attribution, automatically tracked.

<!-- P06 -->
Compare that to a small fix I shipped the same day:

```json
{
  "agent_lines": 1,
  "human_added": 101,
  "agent_percentage": 0.98,
  "total_committed": 102,
  "files_touched": 1
}
```

<!-- P07 -->
One line. 0.98%. Same session, completely different attribution profiles.

<!-- P08 -->
This is the kind of granularity that matters if you want to understand how AI coding assistants are actually being used, at commit-level resolution.

## Beyond line counts: behavioral modeling

<!-- P09 -->
The attribution numbers are useful, but the logs reveal something more interesting. Entire tracks a full state machine for every interaction:

```
"" → active → active_committed → idle → ended
Events: TurnStart, GitCommit, TurnEnd, SessionStop
```

<!-- P10 -->
This is not just logging. It is behavioral modeling. An engineering manager could answer questions like:

- How many turns did it take before the developer committed? (10 turns for 1 commit and 1 turn for the small fix)
- I could even see the idle gaps between prompts! First session has a 12-hour gap between prompts 4 and 5. That might tell you something about how the developer worked through the problem. (I had slept on it.)
- Did the developer review before committing, or commit immediately after the AI finished? (for the quick fix, 1 minute. For the larger feature, 2 hours. It was dinner time!)

<!-- P11 -->
These are the kinds of signals that turn raw attribution data into actual workflow intelligence.

### Subagent tracking: AI spawning AI

<!-- P12 -->
Digging deeper into the logs, there is another layer worth noting. Entire tracks when the AI agent spawns sub-agents:

<!-- P13 -->
```json
{"msg": "pre-task", "tool_use_id": "toolu_015PeVq...", ...}
{"msg": "post-task", "subagent_type": "Explore", "agent_id": "a4f22a2"}
{"msg": "task checkpoint saved", "checkpoint_type": "task", "subagent_type": "Explore"}
```

<!-- P14 -->
In this case, Claude Code spawned an "Explore" agent to research the codebase before making changes. Entire creates separate task-level checkpoints for these delegated operations.

<!-- P15 -->
For governance, this matters. The AI is not just writing code. It is delegating research to child processes, and all of it is tracked. If a team wants to understand not just what was generated but how the AI arrived at its approach, the subagent trail provides that visibility.

## The human work that does not show up

<!-- P16 -->
Here’s what the 78% attribution number does not capture: the human contribution that made it possible.

<!-- P17 -->
Before prompting the AI, I:

- Researched UX patterns for the feature.
- Evaluated slider interfaces, input fields, and visual representations
- Made product decisions
- Considered edge cases
- Sketched (with words) the user flow and state changes

<!-- P18 -->
I shaped the feature. The AI wrote the code.

<!-- P19 -->
The logs show `human_added: 101`, but that value was consistent across every commit, which suggests it’s tracking something other than feature-specific human contribution. If teams are going to use attribution as governance data, understanding what that metric actually measures matters. I have filled an issue with Entire. We shall see.

## Two strategies: control vs convenience

<!-- P20 -->
Entire offers two commit strategies.

<!-- P21 -->
**Manual-commit (default):** Checkpoints are created when you commit. Your git history stays clean. Shadow branches provide safety during active work. If something goes wrong mid-session, you can rewind.

<!-- P22 -->
**Auto-commit:** Checkpoints are created after each AI response. You get granular history, but your branch fills with `[entire]` prefixed commits. This is best for feature branches you plan to squash later.

<!-- P23 -->
I used manual-commit. I thought it was right to control the commit message and timing while Entire tracked session metadata quietly in the background. But this was in a shadow/orphan branch that entire creates. The orphan branch grows forever. Every session from every developer — including abandoned PRs and throwaway experiments — accumulates on entire/checkpoints/v1. There's an entire clean command for local shadow branches, but no retention policy for the permanent metadata branch.

It gets pushed automatically via a pre-push git hook. Multiple developers pushing to the same branch works because checkpoint IDs are random 12-hex-char strings, so collisions are essentially impossible. If a push fails (non-fast-forward), the CLI fetches, merges trees, and retries. No merge conflicts possible since it's just a tree union.

All that being said, I am not sure exactly what the best practice is around this. Also, do we need to worry about privacy when the whole teams agent conversations are available to be seen with anyone with repo access? 

## Why this matters for engineering teams

<!-- P24 -->
### 1) Compliance and audit trails

<!-- P25 -->
SOC 2 and ISO audits increasingly ask about AI usage. M&A diligence wants to understand codebase composition. The EU AI Act might also change the landscape further.

<!-- P26 -->
Entire creates an audit trail automatically with minimal developer friction.

<!-- P27 -->
### 2) Honest attribution (and honest limits)

<!-- P28 -->
“How much of our code is AI-generated?” is a question every engineering leader will face. Entire answers it with actual data.

<!-- P29 -->
Attribution does not equal understanding, quality, or correctness, but it’s still a useful signal.

<!-- P29a -->
I'm still only exploring this tool personally, so I can't claim anything concrete from our teams yet. In our experience, earlier models correlated with higher defect rates, while newer models appear to have improved that significantly. Review dynamics are mixed: AI-generated code can increase reviewer workload, but using AI as a reviewer is already reducing end-to-end review time.

<!-- P30 -->
### 3) Incident response

<!-- P31 -->
When something breaks, you can trace back not just what changed, but how it was created:

- Was it a human typo or an AI hallucination?
- What was the prompt?
- What context did the agent have?

<!-- P32 -->
Entire preserves this. For changes spanning multiple files, it can save real time during debugging.

<!-- P33 -->
### 4) Team learning

<!-- P34 -->
Auto-summarization (Claude-generated) can capture intent, decisions, friction points, and open items. For async teams and onboarding, that context is valuable.

## What would make this better

<!-- P35 -->
After using Entire across a couple features here’s what I’d want next.

### Better (or maybe more accurate) human contribution metrics

<!-- P36 -->
The `human_added: 101` value was identical across both our commits, including a 1-line fix and a 357-line feature. That suggests it is measuring something structural rather than literal keystrokes. But what is it measuring?

### PR integration

<!-- P39 -->
Show attribution automatically in pull request descriptions. Reviewers should know something like:

<!-- P40 -->
“This PR is 78% AI-generated across 8 files, primarily UI components.”

<!-- P41 -->
Different attribution profiles should imply different review strategies.

### Risk scoring

<!-- P42 -->
Not all AI-generated code carries the same risk. Flagging high-risk patterns would help teams apply attention where it matters:

- AI-generated authentication/authorization code
- AI-generated database migrations or schema changes
- AI-generated code with no corresponding tests
- High AI percentage in critical business logic paths

### Session context in code review

<!-- P43 -->
When reviewing a PR with high AI attribution, let reviewers access the original prompts and AI reasoning, without having to reference the Entire tracking branch. Knowing why the AI made a particular choice often determines whether the reviewer can validate it quickly.

### Full conversation context (not just the triggering prompt)

<!-- P44 -->
Entire generates a `context.md` file that’s genuinely useful: files changed with descriptions, a feature summary, and key tool actions.

<!-- P45 -->
But the “Prompt” field only captures the triggering prompt, which can miss most of the real deliberation. The 10+ messages that shape a feature are usually the important part:

<!-- P46 -->
Entire captures the full transcript in `.jsonl` files. Surfacing that deliberation in `context.md` would transform it from “what was built” to “how and why it was built.”

### Prompt replay

<!-- P47 -->
Letting me replay a session’s prompts against a newer model to see if the approach changes. That’s useful for evaluating model upgrades, and for catching improvements without rewriting the workflow. It might do this, but it wasn't clear to me how.

### Team analytics

<!-- P49 -->
Finally, the obvious manager view:

- Which repos have the highest AI contribution?
- How does attribution vary by feature type?
- Where are we seeing the most session rewinds (a proxy for AI mistakes that needed correction)?


## The bottom line

<!-- P56 -->
AI coding assistants are not going away. The question is not whether your team uses them. It’s whether you have visibility into how they’re used.

<!-- P57 -->
Entire CLI gives you that visibility with minimal friction. We shipped a 357-line feature and a 1-line fix in the same session. Both got full attribution. I committed normally, and the data was just there.

---

Helpful Links:

- [Entire CLI GitHub](https://github.com/entireio/cli)
- [Entire CLI Strategies Documentation](https://docs.entire.io/cli/strategies)
- [Tech Edu Byte: Entire CLI Overview](https://www.techedubyte.com/entire-cli-git-based-ai-agent-observability-tool/)
- [Entire Dispatch 0x0002](https://entire.io/blog/entire-dispatch-0x0002)
