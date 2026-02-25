---
title: "I Tried Entire CLI for AI Code Attribution: What Engineering Teams Should Know"
description: "A practical look at Entire CLI’s commit-level AI attribution, what it captures well, and what’s still missing for real engineering governance."
pubDatetime: 2026-02-26T08:00:00-08:00
tags:
  - ai
  - developer-tools
  - engineering-management
  - governance
  - productivity
---

Late last week, we shipped a feature that touched 8 files across the codebase. The attribution data captured by the Entire CLI told a clear story.

## What Entire CLI actually does

[Entire CLI](https://github.com/entireio/cli) hooks into your git workflow and AI coding agent (Claude Code or Gemini CLI) to capture session data: transcripts, file modifications, timestamps, and reasoning.

It attaches that context to your commits without polluting your main git history. Session data lives on a separate `entire/checkpoints/v1` branch.

After our weighted randomization commit, the logs showed:

```json
{
  "agent_lines": 357,
  "human_added": 101,
  "agent_percentage": 77.95,
  "total_committed": 458,
  "files_touched": 8
}
```

357 lines of AI-generated code across 8 files. 78% of the commit. Full attribution, automatically tracked.

Compare that to a small fix we shipped the same day: making “Pick Again” immediately trigger a new randomization.

```json
{
  "agent_lines": 1,
  "human_added": 101,
  "agent_percentage": 0.98,
  "total_committed": 102,
  "files_touched": 1
}
```

One line. 0.98%. Same session, same developer, completely different attribution profiles.

This is the kind of granularity that matters if you want to understand how AI coding assistants are actually being used, at commit-level resolution.

## Beyond line counts: behavioral modeling

The attribution numbers are useful, but the logs reveal something more interesting. Entire tracks a full state machine for every interaction:

```
"" → active → active_committed → idle → ended
Events: TurnStart, GitCommit, TurnEnd, SessionStop
```

This is not just logging. It is behavioral modeling. An engineering manager could answer questions like:

- How many turns did it take before the developer committed?
- How long were idle gaps between prompts? Our weighted randomization session has a 12-hour gap between prompts 4 and 5, showing timestamps of 22:14 one evening and 07:47 the next morning. That tells you something about how the developer worked through the problem: they slept on it.
- Did the developer review before committing, or commit immediately after the AI finished?

These are the kinds of signals that turn raw attribution data into actual workflow intelligence.

### Subagent tracking: AI spawning AI

Digging deeper into the logs, there is another layer worth noting. Entire tracks when the AI agent spawns sub-agents:

```json
{"msg": "pre-task", "tool_use_id": "toolu_015PeVq...", ...}
{"msg": "post-task", "subagent_type": "Explore", "agent_id": "a4f22a2"}
{"msg": "task checkpoint saved", "checkpoint_type": "task", "subagent_type": "Explore"}
```

In this case, Claude Code spawned an "Explore" agent to research the codebase before making changes. Entire creates separate task-level checkpoints for these delegated operations.

For governance, this matters. The AI is not just writing code. It is delegating research to child processes, and all of it is tracked. If a team wants to understand not just what was generated but how the AI arrived at its approach, the subagent trail provides that visibility.

## The human work that does not show up

Here’s what the 78% attribution number does not capture: the human contribution that made it possible.

Before prompting the AI, we:

- Researched UX patterns for weight-based randomization
- Evaluated slider interfaces, input fields, and visual representations
- Made product decisions about where weights should appear (edit view only, or also randomizer?)
- Considered edge cases like zero-weight items and weight normalization
- Sketched the user flow and state changes

The AI wrote the code. We shaped the feature.

The logs show `human_added: 101`, but that value was consistent across every commit, which suggests it’s tracking something other than feature-specific human contribution. If teams are going to use attribution as governance data, understanding what that metric actually measures matters.

## Two strategies: control vs convenience

Entire offers two commit strategies.

**Manual-commit (default):** Checkpoints are created when you commit. Your git history stays clean. Shadow branches provide safety during active work. If something goes wrong mid-session, you can rewind.

**Auto-commit:** Checkpoints are created after each AI response. You get granular history, but your branch fills with `[entire]` prefixed commits. This is best for feature branches you plan to squash later.

We used manual-commit. It felt right: we controlled the commit message and timing while Entire tracked session metadata quietly in the background. For a 357-line feature spanning 8 files, having that single clean commit mattered.

## Why this matters for engineering teams

### 1) Compliance and audit trails

The EU AI Act is phasing in. SOC 2 and ISO audits increasingly ask about AI usage. M&A diligence wants to understand codebase composition.

Entire creates an audit trail automatically with minimal developer friction.

### 2) Honest attribution (and honest limits)

“How much of our code is AI-generated?” is a question every engineering leader will face. Entire answers it with actual data.

But that 78% was guided by human research, design decisions, and product thinking. Attribution does not equal understanding, quality, or correctness. It’s a useful signal, not a verdict.

### 3) Incident response

When something breaks, you can trace back not just what changed, but how it was created:

- Was it a human typo or an AI hallucination?
- What was the prompt?
- What context did the agent have?

Entire preserves this. For changes spanning multiple files, it can save real time during debugging.

### 4) Team learning

Auto-summarization (Claude-generated) can capture intent, decisions, friction points, and open items. For async teams and onboarding, that context is valuable.

## What would make this better

After using Entire across multiple commits in a real session, here’s what I’d want next.

### Better human contribution metrics

The `human_added: 101` value was identical across both our commits, including a 1-line fix and a 357-line feature. That suggests it is measuring something structural rather than literal keystrokes. But what is it measuring?

I’d want:

- Clear documentation of what `human_added` actually tracks
- Metrics that better capture the research, design, and decision work that precedes prompting
- Differentiation between “human wrote this code” and “human guided this AI output”

### Attribution by code category

Not all 357 lines carry equal weight. It would be far more actionable to break attribution down by:

- Business logic vs UI components vs type definitions vs tests
- Complexity-weighted attribution (a one-line algorithm change vs a one-line import)
- Which specific files were primarily AI-generated vs human-modified

### PR integration

Show attribution automatically in pull request descriptions. Reviewers should know something like:

“This PR is 78% AI-generated across 8 files, primarily UI components.”

Different attribution profiles should imply different review strategies.

### Risk scoring

Not all AI-generated code carries the same risk. Flagging high-risk patterns would help teams apply attention where it matters:

- AI-generated authentication/authorization code
- AI-generated database migrations or schema changes
- AI-generated code with no corresponding tests
- High AI percentage in critical business logic paths

### Session context in code review

When reviewing a PR with high AI attribution, let reviewers access the original prompts and AI reasoning. Knowing why the AI made a particular choice often determines whether the reviewer can validate it quickly.

### Full conversation context (not just the triggering prompt)

Entire generates a `context.md` file that’s genuinely useful: files changed with descriptions, a feature summary, and key tool actions.

But the “Prompt” field only captures the triggering prompt, which can miss most of the real deliberation. The 10+ messages that shape a feature are usually the important part:

- “Maybe weighting in a list? Any other ideas?”
- “Would weight by default be an equal amount per list item out of 100%?”
- “I’m not sure a 1–5 range will make sense. Can you research examples?”
- Discussions about where weights should appear, persistence, and visual feedback

Entire captures the full transcript in `.jsonl` files. Surfacing that deliberation in `context.md` would transform it from “what was built” to “how and why it was built.”

### Prompt replay

Let me replay a session’s prompts against a newer model to see if the approach changes. That’s useful for evaluating model upgrades, and for catching improvements without rewriting the workflow.

### IDE integration

The CLI approach is clean, but surfacing attribution in VS Code or JetBrains during review would reduce context switching. Hovering a function to see “87% AI-generated in session abc123” would be powerful.

### Team analytics

Finally, the obvious manager view:

- Which repos have the highest AI contribution?
- How does attribution vary by feature type?
- Where are we seeing the most session rewinds (a proxy for AI mistakes that needed correction)?

## What is already changing

A week after I tested Entire CLI, the team shipped [Dispatch 0x0002](https://entire.io/blog/entire-dispatch-0x0002) with updates that address several of the gaps I flagged above.

**Gemini CLI support is live.** Full transcript parsing, Checkpointing, and session explanations now work with Gemini CLI alongside Claude Code. The underlying multi-agent framework was refactored to make adding new agents faster. This matters: attribution only works if it covers the tools your team actually uses.

**Secret detection is built in.** Checkpoints now run layered secret scanning using gitleaks patterns combined with entropy analysis. Secrets are redacted across all persistence paths, including shadow branches, metadata, and condensed logs. For teams evaluating Entire for compliance, this removes a real blocker.

**Checkpoint reliability improved across the board.** Subagent task modifications are captured correctly, deleted files are tracked, and each Checkpoint produces exactly one commit. Session restore after branch operations (stash, pull, rebase) also works reliably now.

The pace is encouraging. The core product gaps are closing fast.

## The bottom line

AI coding assistants are not going away. The question is not whether your team uses them. It’s whether you have visibility into how they’re used.

Entire CLI gives you that visibility with minimal friction. We shipped a 357-line feature and a 1-line fix in the same session. Both got full attribution. We committed normally, and the data was just there.

The raw numbers are only the start. The real value is the context: what the human contributed, how the AI was guided, and what decisions shaped the output.

---

Sources:

- [Entire CLI GitHub](https://github.com/entireio/cli)
- [Entire CLI Strategies Documentation](https://docs.entire.io/cli/strategies)
- [Tech Edu Byte: Entire CLI Overview](https://www.techedubyte.com/entire-cli-git-based-ai-agent-observability-tool/)
- [Entire Dispatch 0x0002](https://entire.io/blog/entire-dispatch-0x0002)
