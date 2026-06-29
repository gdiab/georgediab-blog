# Handoff — AEO Agent Experience feature

**For:** a fresh Claude session continuing this work.
**Created:** 2026-06-28
**Branch:** `feat/aeo-agent-experience` (already checked out; off `main`)

## TL;DR of what to do next

The design spec is **complete, grilled, and approved by George**. Your job is the
**next gate only**: turn the spec into a step-by-step implementation plan.

1. Read the spec: `docs/superpowers/specs/2026-06-27-aeo-agent-experience-design.md`
2. Invoke the **`writing-plans`** skill (superpowers) and produce an implementation
   plan from that spec.
3. **Do NOT write feature code yet.** Plan first, then let George review the plan
   before implementation (that's the following gate).

## How we got here

- Feature: "Agent Experience Optimization (AEO)" — give every blog post an agent
  layer (Read ⟷ 🤖 Agent toggle, ready-to-run prompts, mid-post banner) plus an
  authored summary for crawling agents. Inspired by Every's "read with your agent."
- We ran `superpowers:brainstorming` → design, then a `/grilling` session
  (Matt Pocock skill, now installed in `~/.claude/skills/`) that materially
  changed the design. The spec reflects all final decisions.

## Key decisions already locked (don't re-litigate; they're in the spec)

- **Copy-first primary action.** Per-prompt "Copy" = `prompt + "\n\n---\n\n" +
  full post markdown` (works in any agent, browsing or not). ChatGPT/Claude
  deep-links are secondary and use `prompt + Source: <.md URL>`.
- **Two audiences:** (1) human handing post to their agent; (2) autonomous/crawling
  agent — which gets an authored `agentSummary`.
- **New frontmatter fields:** `agentSummary` (2–3 sentence TL;DR) and
  `agentPrompts` (string[]). Both optional with fallbacks (summary → `description`,
  prompts → generic default set of 5).
- **`agentSummary` is agent-facing only** — surfaced in the `.md` TL;DR prepend,
  JSON-LD `abstract`, and the agent panel. **No visible human TL;DR**; Read view
  unchanged.
- **`/aeo` Claude Code skill** generates both fields at authoring time → frontmatter.
  No SDK, no API key, never in the build/commit pipeline.
- **`llms.txt`:** add one header line ("append `.md` to any post URL for clean
  markdown"); keep concise one-liners + HTML links.
- **Toggle:** full-swap, Read default, `#agent` linkable. Mid-post banner copy:
  "Would you rather read this with an agent? Grab ready-to-run prompts in a
  copy-ready version."
- **`.md` route fix:** align slug to `getPath(post.id, post.filePath, false)` for
  URL parity with the canonical HTML page.
- **Backfill:** both fields for the 14 posts in `src/content/blog/2026/` only;
  everything else degrades via fallbacks.
- **Deferred:** pre-commit warn hook; headless SDK generation; pre-2026 backfill.

## Files the plan will touch (per spec, for orientation)

- `src/content.config.ts` (schema: add `agentSummary`, `agentPrompts`)
- `src/consts.ts` (`AGENT_TOOLS`)
- `src/utils/agentMode.ts` (new helpers)
- `src/components/AgentMode.astro` (new component)
- `src/layouts/PostDetails.astro` (wire it in)
- `src/pages/posts/[...slug].md.ts` (slug parity + TL;DR prepend)
- `src/components/StructuredData.astro` (add `abstract`)
- `src/pages/llms.txt.ts` (instruction line)
- `.claude/skills/aeo/SKILL.md` (new `/aeo` skill)
- `CLAUDE.md` (authoring convention)
- 14 posts in `src/content/blog/2026/` (backfill, via `/aeo`)

## Project guardrails (from CLAUDE.md)

- Use `npm run build` to verify — **never `npm run dev`** in agent mode.
- Use `gsed`, not `sed`. Use latest deps; never downgrade.
- Don't create/modify blog post *content* without George's consent — backfill here
  is limited to adding `agentSummary`/`agentPrompts` frontmatter, which is the
  agreed scope.
- Git: commit messages must not mention Claude in the body text per global rules,
  but DO keep the required `Co-Authored-By` / `Claude-Session` trailers.

## Current git state

- Branch `feat/aeo-agent-experience`, 2 commits ahead of `main`:
  - `Add AEO agent-experience design spec`
  - `Refine AEO spec via grilling session`
- Working tree: this handoff doc is the only new addition.

## Verification expectations (for later, post-implementation)

`npm run build` passes; spot-check a 2026 post (custom) and a pre-2026 post
(fallbacks); `.md` link resolves with TL;DR prepend; JSON-LD `abstract` present;
`llms.txt` instruction line present; copy/deep-links/toggle/banner all work.
