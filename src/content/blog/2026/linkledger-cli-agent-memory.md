---
title: "Building linkledger-cli: A Local-First Memory Layer for AI Agents"
description: "How we built a local-first memory layer that captures sources quickly and returns compact, provenance-aware evidence packs for AI agents."
pubDatetime: 2026-03-02T09:00:00-08:00
tags: ["ai", "agents", "software-engineering", "architecture", "tools"]
heroImage: "/posts/linkledger-cli-agent-memory/hero.jpg"
draft: true
---

## Where Our Heads Were At

When we cooked this idea up, we were trying to solve a very boring but expensive problem: great sources were scattered across chats, tabs, and notes, so every new draft started with the same research loop again.

Pocket was the reference point. If you never used it, Pocket was a "save this for later" app for links and articles: one place to collect what mattered so you could reuse it later.

We wanted that exact behavior for AI-agent workflows, where both humans and agents need the same source memory. Agent memory drift was part of it, but the bigger goal was a Pocket-for-agents system: capture fast, organize lightly, and retrieve compact, high-signal evidence on demand. The implementation bet was to start as developer infrastructure, with a CLI that is fast, scriptable, and deterministic.

## What We Actually Built

`linkledger-cli` is the CLI-first core of a Pocket-for-agents system:

- Save URLs fast.
- Ingest and normalize content asynchronously.
- Add highlights, lowlights, notes, and tags with actor provenance.
- Retrieve compact, ranked evidence packs for downstream agent tasks.

The system is optimized for low-token retrieval and deterministic machine consumption.

## Why This Shape Works for AI Agents

For teams already orchestrating agent workflows, three constraints matter:

1. Retrieval needs to be cheap and composable.
2. Evidence needs provenance and confidence metadata.
3. Tooling needs to run where agents and operators already work.

That drives the architecture:

- CLI-first interface for scriptability and agent ergonomics.
- Stable JSON envelope on every command for automation.
- Local SQLite as the system of record for zero infra overhead.
- FTS5 + BM25 ranking now, with room for hybrid retrieval later.

This gives us "production-enough" memory without introducing a new service boundary.

## System Design in Practice

### 1. Save path is instant, ingest is async

`save` canonicalizes the URL, dedupes by canonical URL, creates the item record, and enqueues an ingest job. It can also attach an initial note and tags in the same transaction.

The important part: user intent is captured immediately, while parsing and enrichment happen in the background worker.

### 2. Explicit ingestion lifecycle

Items move through clear states:

- `metadata_saved`
- `parsed`
- `enriched`
- `failed`

There are first-class ops commands (`status`, `retry`, `worker`) so ingest failures are observable and recoverable, not silent.

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

This is intentionally simple and interpretable. The goal is control and debuggability before complexity.

### 5. Retrieval is highlight-first by default

`find` and `brief` return compact context first:

- short snippet
- top highlights/lowlights/notes
- ranking rationale (`why_ranked`)
- enrichment artifacts (`summary`, `key_claims`) for briefs

Full chunk expansion is opt-in, so default output stays token-efficient.

### 6. Freshness without cron complexity

A stale revalidation service can enqueue re-ingest jobs for older content (default threshold: 30 days) when content is accessed via retrieval. This keeps memory useful over time with minimal operational surface area.

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

That one decision makes this easy to slot into agent pipelines and content workflows.

## Data Model Choices That Matter

A few choices carried most of the quality load:

- Canonical URL + deterministic item IDs for idempotent saves.
- Separate tables for `items`, `content_chunks`, `annotations`, `tags`, `artifacts`, and `ingest_jobs`.
- Actor and confidence stored on annotations for trust calibration.
- Search index synchronized from items, chunks, and annotations.

This structure supports both human and agent contributions while keeping provenance queryable.

## Tradeoffs We Chose

We made deliberate v1 tradeoffs:

- No web UI yet: faster iteration and less surface area.
- Lexical search first, semantic later: easier to reason about and tune.
- Single-user local model first: optimize for one operator + many agents before collaboration features.

For this stage, reliability and explainability beat sophistication.

## What Surprised Us

The highest leverage feature was not "better summarization." It was strict operational clarity:

- explicit ingest states
- deterministic IDs
- retry semantics
- compact retrieval defaults

In other words, agent memory behaves more like a queue-backed data product than a note-taking app.

## What We Want to Build Next

Near-term extensions are straightforward:

1. Add hybrid lexical + semantic retrieval behind the same command surface.
2. Improve enrichment quality with stronger claim extraction and source-aware summarization.
3. Add a minimal human curation UI only where CLI friction becomes real (inbox, highlight review, retry/status).

The main principle remains: keep the memory layer boring, deterministic, and cheap to consume.

## Why We Are Excited About It

This started as "we are tired of repeating the same research loop," and it turned into a tool we want in agent workflows where source memory and evidence quality actually matter.

The interesting part is not that it stores links. The interesting part is that it turns saved sources into reusable evidence packs with provenance, ranking signals, and a contract agents can consume reliably.

One place we are especially excited to try this is [OpenClaw](https://github.com/openclaw/openclaw), where agents are already taking action across real workflows and source-backed context can improve output quality.

If you are building with agents, this is the bar we would recommend:

- memory you can query quickly
- context you can trust
- outputs you can wire into real workflows without glue-code chaos

Today, that naturally maps to CLI-native environments like Claude Code and Codex CLI. Over time, the same model can fit desktop agent apps too, as long as they expose tool hooks (CLI execution, MCP, or plugin interfaces) that can call into the same retrieval contract.

That is what `linkledger-cli` is for us right now: a practical Pocket-for-agents core for these types of workflows. We are also genuinely curious to see what other interesting use cases people find.
