---
title: "AI Wrote 100% of This Code. Here's the Proof."
description: "Two runs of Entire CLI for AI code attribution: what the first test made ambiguous, what the second prompt-only run clarified, and what still needs interpretation."
pubDatetime: 2026-03-03T08:00:00-08:00
tags:
  - ai
  - developer-tools
  - engineering-management
  - governance
  - productivity
---

In a prompt-only coding session, Entire CLI recorded 100% AI attribution across 871 lines and 9 files. Zero human-authored code. And it was right.

But it took two runs to get there. Here's what happened.

## What Entire CLI does

[Entire CLI](https://github.com/entireio/cli) hooks into your git workflow and coding agent session, then records attribution and context alongside commits. In my usage, metadata was stored in the `entire/checkpoints/v1` branch while my working branch history stayed normal.

## Run 1 (February 14-15, 2026): useful, but ambiguous

I ran my first test on [ListLotto](https://listlotto.com), a personal side project built with React, TypeScript, and Supabase. I saw two very different commit shapes:

### Small fix (February 14, 2026)

```json
{
  "agent_lines": 1,
  "human_added": 101,
  "human_modified": 0,
  "human_removed": 0,
  "total_committed": 102,
  "agent_percentage": 0.98,
  "files_touched": 1
}
```

### Feature commit (February 15, 2026)

```json
{
  "agent_lines": 357,
  "human_added": 101,
  "human_modified": 0,
  "human_removed": 0,
  "total_committed": 458,
  "agent_percentage": 77.95,
  "files_touched": 8
}
```

The high-level attribution looked directionally right (small fix vs larger feature), but `human_added: 101` being identical in both commits made me cautious about over-interpreting that field.

## Run 2 (February 28, 2026): prompt-only test

So I ran a second test. This time I constrained myself to prompting only.

I gave requirements, reviewed output, asked for adjustments, and asked for commits/merge. I did not manually author code in the changed files.

Entire recorded two attribution events:

### Main implementation commit (February 28, 2026, 3:57 PM PT)

```json
{
  "agent_lines": 826,
  "human_added": 0,
  "human_modified": 0,
  "human_removed": 0,
  "total_committed": 826,
  "agent_percentage": 100,
  "accumulated_user_added": 4,
  "files_touched": 8
}
```

### Follow-up UX fix commit (February 28, 2026, 4:59 PM PT)

```json
{
  "agent_lines": 45,
  "human_added": 0,
  "human_modified": 0,
  "human_removed": 0,
  "total_committed": 45,
  "agent_percentage": 100,
  "accumulated_user_added": 12,
  "files_touched": 1
}
```

## What the second run clarified

1. Commit-level attribution can cleanly show a prompt-only workflow.
2. `human_added/human_modified/human_removed` all being zero in both commits matched what I actually did.
3. The metric behavior is more believable for governance reporting when workflow constraints are explicit.

## What is still unclear

`accumulated_user_added` still increased (`4` then `12`) even while commit-level human code contribution stayed zero.

My current interpretation is that Entire tracks multiple attribution layers (session/prompt context vs finalized commit diff), and those layers are easy to conflate if you only glance at one field.

So my practical takeaway is:

- Use commit-level fields for "who wrote committed code" style questions.
- Treat accumulated/session fields as workflow context signals.
- Validate metric scope before using numbers in policy, performance, or compliance conversations.

## Why this matters for engineering teams

### 1) Better AI usage visibility

Most teams will be asked, "How much of this code was AI-generated?" Entire can answer with concrete commit-level data.

### 2) Better incident forensics

When a change breaks, having prompts + session history + attribution in one trail is useful for root-cause analysis.

### 3) Better review strategy

A commit with low AI attribution and a commit with 100% AI attribution should not be reviewed the same way.

## What I would still like to see from Entire

- Clearer definitions in output for fields that mix layers (especially accumulated vs commit-scoped metrics).
- Built-in PR annotations (e.g., attribution summary attached to PR description/checks).
- Retention/privacy controls for long-lived checkpoint metadata branches.
- Easier reviewer UX for seeing prompt context without spelunking raw session artifacts.

## Bottom line

My first run made me curious. My second run gave me better clarity about how things were tracked and working.

Entire CLI looks genuinely useful for commit-level AI attribution, especially when you need an auditable trail with low process overhead. But if you are using it for governance, you should still read field semantics carefully and separate commit facts from session-level context metrics.

**A note on versions:** Both runs used the same Entire CLI version (`0.4.8`, build `81ddee25`), installed February 14, 2026. The agent session envelope `version` field moved from `2.1.19` to `2.1.63` between runs, but I'm treating this comparison as workflow-driven, not version-driven.

---

**Links:** [Entire CLI on GitHub](https://github.com/entireio/cli) | [Entire CLI Strategies Docs](https://docs.entire.io/cli/strategies) | [Tech Edu Byte Overview](https://www.techedubyte.com/entire-cli-git-based-ai-agent-observability-tool/) | [Entire Dispatch 0x0002](https://entire.io/blog/entire-dispatch-0x0002)
