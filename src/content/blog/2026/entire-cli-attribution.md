---
title: "Experimenting with the Entire CLI for AI Code Attribution"
description: "A two-run case study of Entire CLI attribution: what the first test made ambiguous, what the second prompt-only run clarified, and what still needs interpretation."
pubDatetime: 2026-03-03T08:00:00-08:00
tags:
  - ai
  - developer-tools
  - engineering-management
  - governance
  - productivity
---

As AI agents write more production code, engineering teams face a straightforward question: who actually wrote what? Git tracks commits, but it does not distinguish between lines a human typed and lines an agent generated. That gap matters for code review, incident response, and compliance.

I tested [Entire CLI](https://github.com/entireio/cli) twice on one of my personal projects to see how well it fills that gap. The first run surfaced useful data but left me with questions. The second run, where I constrained myself to prompting only, gave me clearer answers.

## What Entire CLI does

Entire CLI hooks into your git workflow and coding agent session, then records attribution and context alongside commits. In my usage, metadata was stored in the `entire/checkpoints/v1` branch while my working branch history stayed normal.

Setup took about two minutes. I installed via Homebrew (`brew tap entireio/tap && brew install entireio/tap/entire`), ran `entire enable` in my project directory, and selected Claude Code as my agent. It also supports Gemini CLI, OpenCode, and Cursor. After that, it runs in the background with no workflow changes needed.

**A note on versions:** Both runs used Entire CLI `0.4.8` (build `81ddee25`), installed via Homebrew on February 14, 2026. The agent session envelope `version` field did change between runs (`2.1.19` → `2.1.63`), but I cannot confirm that affected attribution behavior. I am treating the differences between runs as workflow-driven, not version-driven.

## Run 1 (February 14-15, 2026): useful, but ambiguous

In my first run, I saw two very different commit shapes:

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

This is where things got confusing.

The high-level attribution looked directionally right (small fix vs larger feature), but `human_added: 101` being identical in both commits — a 1-line fix and a 357-line feature — made me cautious about over-interpreting that field.

## Run 2 (February 28, 2026): prompt-only test

For the second run, I constrained myself to prompting only.

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

The second run resolved my main question from Run 1. With zero manual code edits, the commit-level fields (`human_added`, `human_modified`, `human_removed`) all came back zero — matching exactly what I did. That is the kind of signal that makes governance reporting believable: when you can point to a controlled workflow and the numbers line up.

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

---

Helpful Links:

- [Entire CLI GitHub](https://github.com/entireio/cli)
- [Entire CLI Strategies Documentation](https://docs.entire.io/cli/strategies)
- [Tech Edu Byte: Entire CLI Overview](https://www.techedubyte.com/entire-cli-git-based-ai-agent-observability-tool/)
- [Entire Dispatch 0x0002](https://entire.io/blog/entire-dispatch-0x0002)
