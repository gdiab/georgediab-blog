---
name: aeo
description: Generate agent-experience frontmatter (agentSummary + agentPrompts) for a blog post. Use when authoring or backfilling a post in src/content/blog/ to add an authored TL;DR for crawling agents and ready-to-run prompts for readers handing the post to their own agent.
---

# AEO — Agent Experience frontmatter generator

Generate two optional frontmatter fields for a blog post so it serves both a
crawling agent (authored summary) and a reader handing the post to their own
agent (tailored prompts). Output is committed as **static frontmatter** — no
SDK, no API key, no build/commit-time generation.

## Input

A path to a post under `src/content/blog/` (e.g.
`src/content/blog/2026/trying-bumblebee.md`). If none is given, ask which post.

## Steps

1. Read the full post (frontmatter + body).
2. Write **`agentSummary`**: 2–3 sentences (~60 words), plain and concrete,
   describing what the post argues and who it helps. Agent-facing — it appears
   in the `.md` TL;DR, JSON-LD `abstract`, and the agent panel. Not promotional.
3. Write **`agentPrompts`**: 2–4 prompts in the **reader's voice** ("me"/"my"),
   tailored to this post's specific content (not the generic defaults). Good
   prompts turn the post into something the reader can act on. Avoid duplicating
   the five generic defaults (Summarize / Make it actionable / Draft a LinkedIn
   post / Apply to me / Go deeper) verbatim — make them post-specific.
4. Insert both fields into the existing YAML frontmatter, preserving all other
   fields and formatting. `agentPrompts` is a YAML list of strings.
5. Show the diff and stop. Do **not** alter the post body. Do **not** commit
   unless asked.

## Frontmatter shape

```yaml
agentSummary: "Two to three sentences describing the post's argument and audience."
agentPrompts:
  - "First tailored prompt in the reader's voice."
  - "Second tailored prompt."
```

## Notes

- Both fields are optional. Omitting `agentSummary` falls back to `description`;
  omitting `agentPrompts` falls back to the generic default set. Only add value
  beyond those fallbacks.
- Keep YAML valid: quote strings containing colons; use literal block scalars
  (`>` / `|`) only if a value needs multiple lines.
