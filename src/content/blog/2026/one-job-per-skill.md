---
title: "One job per skill: how I curate my agent stack"
description: "Why I stopped installing agent skill plugins whole, the one-skill-per-job rule I use instead, and three examples from GD Stack."
pubDatetime: 2026-11-08T10:00:00-08:00
tags: ["ai", "agents", "developer-tools", "software-engineering"]
draft: true
---

A skill is a short instruction file a coding agent like Claude Code, Cursor, or Codex loads when a task matches its description, so it knows how to do one job your way. Plugins bundle many of them. If you're new to the idea, [Anthropic's skills docs](https://code.claude.com/docs/en/skills) are a good place to start.

Turn on every popular agent skill plugin at once and you get overlapping triggers. Two skills claim the same job, and you lose track of which instructions the agent is following. That happened to me, so I stopped installing collections whole.

My rule now is that each job gets one skill. If I only need one rule from a big plugin, I keep a copy of that rule and skip the rest. Whatever I borrow, I credit, and where I can, I leave the original text alone. The result is [GD Stack](https://github.com/gdiab/gdstack/blob/main/README.md), the fifteen skills I actually run.

Three examples show how that plays out.

**Left alone.** Jesse Vincent's [verification-before-completion](https://github.com/gdiab/gdstack/blob/main/skills/engineering/verification-before-completion/SKILL.md) says an agent can't call something done, fixed, or passing until it has run the command that checks it and read the output. I ship it unchanged from [Superpowers](https://github.com/obra/superpowers) 6.4.1. I don't run the full Superpowers plugin, because its auto-triggering skills overlap others I use, but nothing else in my set does this job.

**Adapted.** Cursor's [thermo-nuclear code quality review](https://github.com/gdiab/gdstack/blob/main/skills/engineering/thermo-review/SKILL.md) keeps Cursor's review bar unchanged from [cursor-team-kit](https://github.com/cursor/plugins/tree/main/cursor-team-kit). What I added is how to run it on my work: it works out what to review instead of assuming everything against main, and it loads [language-specific guidance](https://github.com/gdiab/gdstack/tree/main/skills/engineering/thermo-review/languages) for the languages in the diff. The part I'd point people to is the [re-review step](https://github.com/gdiab/gdstack/blob/main/skills/engineering/thermo-review/SKILL.md#re-review-round-2-and-later). On a second pass, the reviewer goes back through each earlier finding and marks it resolved, partly resolved, or not resolved, with file and line evidence. A second review has to account for the first one.

**Written from scratch.** [Retro](https://github.com/gdiab/gdstack/blob/main/skills/workflow/retro/SKILL.md) reads a masked summary of a session and suggests at most three changes to the agent's setup. Each one comes with the evidence from the session, a way to measure it, and a date to check it. When that date comes, the next retro recommends keeping, revising, or removing the change. Every suggestion has to show its check can fail and name what must not get worse.

The ideas behind Retro aren't all mine. [Matt Pocock's](https://github.com/mattpocock/skills) retro and writing-for-agents skills shaped the rules about tracing each suggestion to a moment in the session and fixing mechanical mistakes with checks instead of more instructions. Lauren Tan's reflect and recall skills in [pstack](https://github.com/cursor/plugins/tree/main/pstack) are why it treats transcripts as data and keeps only a few strong suggestions. A [paper by Treude and Baltes](https://arxiv.org/abs/2610.34938) on how coding-agent harnesses evolve is why every change comes back for review. If you try one skill from the stack, try this one.

The [CREDITS file](https://github.com/gdiab/gdstack/blob/main/CREDITS.md) lists every source, version, and license. GD Stack is [MIT](https://github.com/gdiab/gdstack/blob/main/LICENSE), and adapted skills keep their upstream notices.

If you already run Superpowers, Matt Pocock's skills, pstack, or Cursor's team kit, you don't need a second copy of the parts I left unchanged. Take the approach instead: decide which job each skill owns, keep the one rule you need rather than the whole plugin, and write down where everything came from.

If any of it is useful, a star on [GD Stack on GitHub](https://github.com/gdiab/gdstack) helps other people find it.
