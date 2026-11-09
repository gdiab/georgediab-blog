---
title: "One job per skill: how I curate my agent stack"
description: "After testing skill sets, I'm collecting what works into gdstack: some skills unchanged, some adapted, some written myself."
pubDatetime: 2026-11-08T10:00:00-08:00
heroImage: "/posts/one-job-per-skill/hero.jpg"
tags: ["ai", "agents", "developer-tools", "software-engineering"]
draft: false
---

A skill is a short instruction file a coding agent like Claude Code, Cursor, or Codex loads when a task matches its description, so it knows how to do one job your way. Plugins bundle many of them. If you're new to the idea, [Anthropic's skills docs](https://code.claude.com/docs/en/skills) are a good place to start.

Turn on every popular agent skill plugin at once and you get overlapping triggers. Two skills claim the same job, and you lose track of which instructions the agent is following. I already understood that, so I was careful about what I installed: trying one skill, turning another off, testing combinations. It worked, but managing it was messy.

After trying different sets of skills and seeing what works for me, I'm collecting the ones I want to keep using into my own bespoke stack. Some stay as they are, some I adapt, and some I write myself. Whatever I borrow, I credit, and where I can, I leave the original text alone. The result is [gdstack](https://github.com/gdiab/gdstack/blob/main/README.md), the fifteen skills I actually run.

<aside class="pull-quote not-prose" aria-hidden="true">
  <p>Some stay as they are, some I adapt, and some I write myself.</p>
</aside>

Three examples show how that plays out.

**Left alone.** Jesse Vincent's [verification-before-completion](https://github.com/gdiab/gdstack/blob/main/skills/engineering/verification-before-completion/SKILL.md) says an agent can't call something done, fixed, or passing until it has run the command that checks it and read the output. I ship it unchanged from [Superpowers](https://github.com/obra/superpowers) 6.4.1. I don't run the full Superpowers plugin, because its auto-triggering skills overlap others I use, but nothing else in my set does this job.

![Styled excerpt card from verification-before-completion showing the Iron Law: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE. If you haven't run the verification command in this message, you cannot claim it passes.](/posts/one-job-per-skill/excerpt-verification-iron-law.png)

*Styled excerpt card, not a screenshot. Source: [verification-before-completion/SKILL.md](https://github.com/gdiab/gdstack/blob/main/skills/engineering/verification-before-completion/SKILL.md).*

**Adapted.** Cursor's [thermo-nuclear code quality review](https://github.com/gdiab/gdstack/blob/main/skills/engineering/thermo-review/SKILL.md) keeps Cursor's review bar unchanged from [cursor-team-kit](https://github.com/cursor/plugins/tree/main/cursor-team-kit). What I added is how to run it on my work: it works out what to review instead of assuming everything against main, and it loads [language-specific guidance](https://github.com/gdiab/gdstack/tree/main/skills/engineering/thermo-review/languages) for the languages in the diff. The part I'd point people to is the [re-review step](https://github.com/gdiab/gdstack/blob/main/skills/engineering/thermo-review/SKILL.md#re-review-round-2-and-later). On a second pass, the reviewer goes back through each earlier finding and marks it resolved, partly resolved, or not resolved, with file and line evidence. A second review has to account for the first one.

![Styled excerpt card from thermo-review re-review selected steps 1, 2, and 4: read the earlier review first; for each earlier finding say resolved, partially resolved or not resolved with file:line evidence; don't open new fronts on untouched code unless a presumptive blocker was missed.](/posts/one-job-per-skill/excerpt-thermo-rereview.png)

*Styled excerpt card with selected steps, not a screenshot. Full re-review protocol: [thermo-review · Re-review](https://github.com/gdiab/gdstack/blob/main/skills/engineering/thermo-review/SKILL.md#re-review-round-2-and-later).*

**Written from scratch.** [Retro](https://github.com/gdiab/gdstack/blob/main/skills/workflow/retro/SKILL.md) reads a masked summary of a session and suggests at most three changes to the agent's setup. Each one comes with the evidence from the session, a way to measure it, and a date to check it. When that date comes, the next retro recommends keeping, revising, or removing the change. Every suggestion has to show its check can fail and name what must not get worse.

The ideas behind Retro aren't all mine. [Matt Pocock's](https://github.com/mattpocock/skills) retro and writing-for-agents skills shaped the rules about tracing each suggestion to a moment in the session and fixing mechanical mistakes with checks instead of more instructions. Lauren Tan's reflect and recall skills in [pstack](https://github.com/cursor/plugins/tree/main/pstack) are why it treats transcripts as data and keeps only a few strong suggestions. A [paper by Treude and Baltes](https://arxiv.org/abs/2610.34938) on how coding-agent harnesses evolve is why every change comes back for review. If you try one skill from the stack, try this one.

The [CREDITS file](https://github.com/gdiab/gdstack/blob/main/CREDITS.md) lists every source, version, and license. The project is [MIT](https://github.com/gdiab/gdstack/blob/main/LICENSE), and adapted skills keep their upstream notices.

If you already run Superpowers, Matt Pocock's skills, pstack, or Cursor's team kit, you don't need a second copy of the parts I left unchanged. Take the approach instead: decide which job each skill owns, keep the one rule you need rather than the whole plugin, and write down where everything came from.

## The rest of the stack

The other twelve, grouped the way the repo is:

**Engineering**

- [debugging](https://github.com/gdiab/gdstack/tree/main/skills/engineering/debugging): finds the root cause before changing code, by building a feedback loop that goes red on the exact symptom.
- [grounded-review](https://github.com/gdiab/gdstack/tree/main/skills/engineering/grounded-review): surveys the project's docs and related context before judging an artifact, then tags every claim by its source.
- [12-factor-eval](https://github.com/gdiab/gdstack/tree/main/skills/engineering/12-factor-eval): scores a repository on each twelve-factor item from code evidence, asks about what the code cannot show, and writes a report with prioritized recommendations.
- [receiving-code-review](https://github.com/gdiab/gdstack/tree/main/skills/engineering/receiving-code-review): Jesse Vincent's rule, unchanged. Verifies review feedback against the codebase before implementing, and pushes back with technical reasoning when the feedback is wrong for this code.

**Workflow**

- [handoff](https://github.com/gdiab/gdstack/tree/main/skills/workflow/handoff): packs the current session so a fresh agent can resume, either as a same-day background session or as a durable `HANDOFF.md`.
- [fanout-lanes](https://github.com/gdiab/gdstack/tree/main/skills/workflow/fanout-lanes): runs one Claude session per independent lane, each in its own git worktree and Herdr pane, while this session plans, waits, and closes them.
- [grilling](https://github.com/gdiab/gdstack/tree/main/skills/workflow/grilling): Matt Pocock's skill, unchanged. Interviews you in rounds over a design tree until nothing is left silently assumed.
- [grill-me](https://github.com/gdiab/gdstack/tree/main/skills/workflow/grill-me): Matt Pocock's slash-command entry point to `grilling`, unchanged.

**Tools**

- [chrome-cdp](https://github.com/gdiab/gdstack/tree/main/skills/tools/chrome-cdp): drives your real, logged-in Chrome over the DevTools Protocol through one long-lived bridge socket after a single consent click.
- [session-usage](https://github.com/gdiab/gdstack/tree/main/skills/tools/session-usage): reports where tokens went across local Claude Code and Codex sessions as metrics only, never message text.
- [excalidraw-diagram](https://github.com/gdiab/gdstack/tree/main/skills/tools/excalidraw-diagram): creates native editable Excalidraw diagrams, validates text and connectors, and renders previews locally.

**Writing**

- [humanizer](https://github.com/gdiab/gdstack/tree/main/skills/writing/humanizer): adapted from [gdiab/humanizer](https://github.com/gdiab/humanizer). Rewrites prose to remove AI writing patterns, audits those patterns without rewriting, or develops a nonfiction story before the prose pass.

If any of it is useful, a star on [gdstack on GitHub](https://github.com/gdiab/gdstack) helps other people find it.
