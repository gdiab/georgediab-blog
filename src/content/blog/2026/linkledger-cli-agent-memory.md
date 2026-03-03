---
title: "Building linkledger-cli: A Local-First Memory Layer for AI Agents"
description: "How I built a local-first memory layer that captures sources quickly and returns compact, source-backed context for AI agents."
pubDatetime: 2026-02-26T10:00:00-08:00
tags: ["ai", "agents", "software-engineering", "architecture", "tools"]
heroImage: "/posts/linkledger-cli-agent-memory/hero.jpg"
draft: false
---

## Where My Head Was At

When I cooked this idea up, I was trying to solve a very boring but expensive problem: great sources were scattered across chats, tabs, and notes, so every new draft started with the same research loop again.

Pocket was the reference point. If you never used it, Pocket was a "save this for later" app for links and articles: one place to collect what mattered so you could reuse it later.

I wanted that exact behavior for AI-agent workflows, where both humans and agents need the same source memory. Agent memory drift was part of it, but the bigger goal was a Pocket-for-agents system: capture fast, organize lightly, and retrieve compact, high-signal evidence on demand. The implementation bet was to start as developer infrastructure, with a CLI that's fast, scriptable, and deterministic.

## What I Actually Built

[`linkledger-cli`](https://github.com/gdiab/linkledger-cli) is the CLI-first core of a Pocket-for-agents system:

- Save URLs fast.
- Ingest and normalize content asynchronously.
- Add highlights, lowlights, notes, and tags that track who added them.
- Retrieve compact, ranked context for downstream agent tasks.

The goal is retrieval that's cheap on tokens and predictable enough for machines to consume without surprises.

## Why This Shape Works for AI Agents

For me, these three constraints mattered:

1. Retrieval needs to be cheap and composable.
2. Evidence needs to carry metadata about where it came from and how confident you are in it.
3. Tooling needs to run where agents and operators already work.

That drove the following architecture:

- CLI-first interface for scriptability and agent ergonomics.
- Stable JSON envelope on every command for automation.
- Local SQLite as the single source of truth, no extra infra to manage.
- FTS5 + BM25 ranking now, with room for hybrid retrieval later.

This gave me working memory without having to stand up a new service.

## System Design in Practice

### 1. Save path is instant, ingest is async

`save` canonicalizes the URL, dedupes by canonical URL, creates the item record, and enqueues an ingest job. It can also attach an initial note and tags in the same transaction.

The important part: your intent is captured immediately, while parsing and enrichment happen in the background worker. This felt like the right split from the start — you don't want saving to block on network calls or parsing.

### 2. Explicit ingestion lifecycle

Items move through clear states:

- `metadata_saved`
- `parsed`
- `enriched`
- `failed`

There are first-class ops commands (`status`, `retry`, `worker`) so ingest failures are observable and recoverable, not silent. I've been burned enough by systems that fail quietly to know this matters early.

### 3. Adapter chain with pragmatic fallbacks

The worker picks adapters by source type:

- Native adapters for `x`, `youtube`, `bluesky`, `linkedin`, and `pdf`
- Fallback to `article` adapter where possible

If a source-specific parser fails, the chain continues. Retryable failures are requeued with exponential backoff.

### 4. Ranking that rewards trust signals

Search runs on SQLite FTS5 with weighted fields. Ranking is:

```text
ranking_score = bm25_score + pinned_boost - low_confidence_penalty
```

Where:

- Pinned annotations add positive signal.
- Low-confidence agent annotations reduce score.

This is intentionally simple and interpretable. I'd rather be able to explain why something ranked high than chase marginal relevance gains I can't debug.

### 5. Retrieval is highlight-first by default

`find` and `brief` return compact context first:

- short snippet
- top highlights/lowlights/notes
- ranking rationale (`why_ranked`)
- enrichment artifacts (`summary`, `key_claims`) for briefs

Full chunk expansion is opt-in, so the default output stays token-efficient.

### 6. Freshness without cron complexity

A stale revalidation service can enqueue re-ingest jobs for older content (default threshold: 30 days) when content is accessed via retrieval. This keeps memory useful over time without adding cron jobs or a separate scheduler to manage. I have noticed how many tokens can get burned by a cron job running only to find nothing needing to be acted on.

## Day-to-Day Workflow

The core drafting loop looks like this:

```bash
linkledger save "https://example.com/source" --note "why this matters" --tags ai-memory --json
linkledger worker --limit 20 --max-attempts 3 --base-backoff-ms 2000 --json
linkledger find "agent memory retrieval" --tags ai-memory --limit 10 --json
linkledger brief "Write a post on local-first agent memory systems" --max-items 8 --json
```

The output contract is stable:

```json
{
  "ok": true,
  "data": {},
  "meta": {
    "timestamp": "2026-02-24T17:00:00.000Z",
    "version": "0.1.0"
  }
}
```

That one decision makes it easy to slot into agent pipelines and content workflows.

## Data Model Choices That Matter

A few choices carried most of the quality load:

- Canonical URL + deterministic item IDs for idempotent saves.
- Separate tables for `items`, `content_chunks`, `annotations`, `tags`, `artifacts`, and `ingest_jobs`.
- Actor and confidence stored on annotations so you can tell what a human flagged vs. what an agent inferred.
- Search index synchronized from items, chunks, and annotations.

This structure supports both human and agent contributions while keeping it easy to trace where any piece of evidence came from.

## Tradeoffs I Chose

These are deliberate v1 tradeoffs — first-pass decisions based on experience, not battle-tested conclusions. I need to use this for a while before I'll know what actually breaks:

- No web UI yet: faster iteration and less surface area.
- Lexical search first, semantic later: easier to reason about and tune.
- Single-user local model first: optimize for one operator + many agents before collaboration features.

For this stage, reliability and explainability beat sophistication.

## What I Want to Build Next

Near-term extensions are straightforward:

1. Add hybrid lexical + semantic retrieval behind the same command surface.
2. Improve enrichment quality with stronger claim extraction and source-aware summarization.
3. Add a minimal human curation UI only where CLI friction becomes real (inbox, highlight review, retry/status).
4. The [SKILL file here](https://github.com/gdiab/linkledger-cli/blob/main/skills/linkledger-cli-agent/SKILL.md) is rather specific to my stack of tools. Namely, the `content-board`, which is a Kanban type board where content is managed through different states of readiness from inbox to published. I'd like to make this even more generic so others can just drop in and start having their agent use it.

The main principle remains: keep the memory layer boring, deterministic, and cheap to consume.

## Why I'm Excited About It

This started as "I'm tired of repeating the same research loop," and it turned into a tool I want in every workflow where source memory and evidence quality actually matter.

The interesting part isn't that it stores links. It's that it turns saved sources into reusable context with ranking signals, provenance, and a stable contract agents can consume without custom glue code.

The first real test case is [OpenClaw](https://github.com/openclaw/openclaw). I'm already using OpenClaw agents to help with research for posts and content, and the missing piece was persistent memory — a way for those agents to store interesting things I've read or consumed so I can come back to them for content ideas or as evidence in future writing. That's the workflow `linkledger-cli` was built for.

If you're building with agents, this is the bar I'd recommend:

- memory you can query quickly
- context you can trust
- outputs you can wire into real workflows without glue-code chaos

Today, that naturally maps to CLI-native environments like Claude Code and Codex CLI. Over time, the same model can fit desktop agent apps too, as long as they expose tool hooks (CLI execution, MCP, or plugin interfaces) that can call into the same retrieval contract.

That's what `linkledger-cli` is for me right now: a practical Pocket-for-agents core. I'm curious to see what other use cases people find for it.
