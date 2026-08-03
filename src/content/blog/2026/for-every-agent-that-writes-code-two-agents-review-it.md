---
title: "For every agent that writes code, two agents review it"
description: "Six weeks of agent-written code with two reviewer agents per writer. What the gate caught: leaked secrets, silent side effects, and what it costs."
pubDatetime: 2026-08-02T16:54:50-07:00
tags: ["ai", "agents", "software-engineering", "developer-tools", "tools"]
draft: false
agentSummary: "Six weeks of running the same review gate across a dozen repos where agents write most of the code. The pipeline: written task briefs, implementer agents, reviewer agents issuing two separate verdicts (matches the brief, and is good code), TDD fix waves, scoped re-reviews limited to ADDRESSED or NOT ADDRESSED, and a final whole-branch review, with a strict maintainability audit and a cross-model Codex second opinion as extras. Measured over the last month: roughly two reviewer agents per implementer, sustained. The receipts include a staged file with live credentials stopped one commit short of git history, a secret-scrubber with a hole in its own regex, unescaped LLM output rendered into another agent's report, and a dry run that executed a real install. Honest costs: double-ish token and time spend, reviewer false positives, and an untested dependence on written briefs."
agentPrompts:
  - "How do I set up a two-verdict review gate (spec compliance vs code quality) for agent-written code?"
  - "What failure classes should reviewer agents specifically look for in agent-written code?"
  - "Why limit scoped re-reviewers to ADDRESSED / NOT ADDRESSED verdicts?"
  - "What are the real costs of running two reviewer agents per implementer agent?"
---

If agents write most of your code, your standards live in exactly one place: the review gate between the agents and your main branch. You can't enforce taste by hovering over every diff anymore; there are too many diffs now. Whatever the gate catches is your quality bar. Whatever it misses ships.

I've spent the last six weeks running the same gate across a dozen repos (my dotfiles, a status-report tool, an eval harness, this blog, a consulting site, some experiments), and I counted what it actually did.

## Two reviewers for every writer

Last week, across four active repos, my sessions spawned 133 subagents. 41 of them wrote or fixed code. 89 reviewed it: 55 task reviews, 20 scoped re-reviews, and 14 final whole-branch passes. The other three were odd jobs that fit neither bucket. Around 1.5 million output tokens, and most of them went to judgment, not generation. Widen the window to the last 28 days and 13 repos and it's roughly 690 subagents. About 270 of those were odd jobs too, research and exploration mostly; the pipeline roles split 251 on the review side against 170 implementers. Two reviewers per writer last week, closer to one and a half over the month.

I counted by classifying each subagent transcript by its first prompt: implement, review, re-review, fix wave, or final review. Token totals come from the usage records. Run the same count next week and the totals will have moved, since sessions pile up daily. The ratio is the part that has held all month.

## What the gate looks like

Every task starts with a written brief, and a real one is specific to the point of pedantry: the files the task may touch, what it consumes from other tasks and produces for them, and numbered steps that include exact before-and-after blocks. An implementer agent builds against it. A reviewer agent then returns two separate verdicts: does this match the brief, and is this good code. Splitting them matters because a single verdict hides the most common failure, which is "matches the spec, and is bad code."

Findings go to a fix wave, and fix waves run TDD: for each fix, write the failing test first, watch it fail, then fix. Scoped re-reviewers check each fix and are allowed exactly two answers, ADDRESSED or NOT ADDRESSED, which kills scope creep dead. A final review reads the whole branch before merge. None of this arrived fully formed. The two-verdict split and the ADDRESSED-only rule came later, after a few reviews went sideways without them.

Credit where due: that skeleton is the [superpowers](https://github.com/obra/superpowers) plugin's subagent-driven development flow. I've added two extras on top. The first is a stricter maintainability-only audit I run before big merges, called [thermo-nuclear-code-quality-review](https://github.com/cursor/plugins/blob/main/thermos/skills/thermo-nuclear-code-quality-review/SKILL.md). The name isn't mine. It's a review skill out of Cursor's official plugins repo, and I ported it over because the posture was too good to leave there. My favorite line from it: "Do not approve merely because behavior seems correct." The second extra is a cross-model second opinion: Codex reviewing Claude's work, read-only.

The gate also has an appeals process. Fixer agents can overrule a reviewer with evidence; the fix prompt says "if you verify one is wrong, say so in your report rather than silently skipping." Reviewers get things wrong, and a gate that pretends otherwise just trains fixers to make cosmetic edits until the reviewer shuts up.

## The catches that made me a believer

The best catches were not style nits. They were the failures that embarrass you in public.

The scariest one came on my consulting site. A task review flagged a staged working file that contained live share links and credentials for a private preview host, graded it CRITICAL, and stopped it one commit short of git history.

Then there's the pair I keep thinking about, both in agent-status-ledger, a tool I'm building that gives me a daily standup for every AI agent I run (it scans their session logs and answers one morning question: what did my agents do, what finished, what failed, what needs me). It has a module whose one job is scrubbing secrets out of report text, and review found a hole in its fallback regex. The module built for protection had the gap. Same repo, different task: the markdown renderer interpolated five LLM-written narrative fields into reports without escaping, so one agent's prose could render raw inside another agent's report. Injection via your own agents' output is a failure class that barely existed two years ago, and an agent caught it.

My favorite is the dry run that installed Homebrew anyway. My dotfiles install script provisions my other Mac over SSH, and its Homebrew self-install curl sat inside a `$(...)` command substitution. Command substitutions run when the line is evaluated, so `--dry-run` executed the install for real, in the middle of a script whose entire job at that moment was "show me what you would do, don't do it." It's internal tooling, I know. But a dry run with a real side effect is not an internal-tooling bug. Products ship that one all the time. Review caught it before the script touched the real machine. That one would have hurt.

The subtlest one: in a model-eval harness, a reviewer flagged run directories where one artifact had been hand-regenerated ("tainted receipts" was its phrase), and a separate CRITICAL found the judge script never checked the fact sheet's hash against the manifest. That's a reviewer defending the benchmark's evidence chain.

And for the obvious objection, that this is one model grading its own homework: the two most decisive verdicts of these six weeks came from unrelated gates agreeing. On one branch, the Codex correctness review and the thermo-nuclear audit both rejected round one, and three of their findings were the same defects found independently. The worst: an 80-character truncation that ran before redaction, so a secret straddling the cut could slip its prefix past the patterns and into a report. It wasn't a one-off, either. On a later branch both gates rejected round one again, this time with different findings that turned out to be symptoms of the same structural mistake, and one fix pass cleared both. Round one of that later branch, verbatim:

```text
codex:  VERDICT: BLOCK - Critical redaction bypass; Important Codex
        title-index scan failure.
thermo: VERDICT: BLOCK
        Blocker 1: scanSessions duplicates per-file orchestration across
        branches and bypasses canonical scanSessionFile (src/sessions.ts:124-160).
```

When two graders who don't share a brain flunk the same homework, it's probably the homework.

## None of this is free

I don't want to oversell this. Two reviewers per writer means every feature costs roughly double in tokens and wall-clock time, and there's no way to spin that as free.

Reviewers false-positive. In one skill eval, the grader flagged two runs for restating code when they had only referenced an identifier by name; the fix went to the grader, not the skill. I didn't catch it live, either. The pipeline diagnosed and repaired its own grader while I was away, and I read about it in the report afterward. The cost wasn't my attention; it was an extra fix round and a re-grade that happened without me.

And a condition I haven't tested: every task in these six weeks had a written brief to verdict against. I've never pointed the gate at vague exploratory work, and I don't expect it to hold up there. The nearest failure I have seen is a reviewer short on context flagging things as unverified that were settled in docs it never read. The gate needs a spec the way a court needs a law.

The gate raises the floor. And, for better or worse, it's replacing my own reading: I don't review every final diff anymore. I'm relying on the process more each week and spending that attention on other work. So far the outcomes seem good. We will see.

## Where this lands

Six weeks in, the gate has caught something real every week: a side effect, a leaked credential, a broken defense, an injection path, a tainted benchmark. None of them were hard bugs to fix. All of them were easy bugs to ship.

If you want to run the same gate, the pieces are two installs and a skill file; the choreography is bundled in [one short gist](https://gist.github.com/gdiab/9bd9098fe2ed75513242fe697f7275d9).

For now, every agent that writes code gets two that review it. They keep earning it.
