# Agent Experience Optimization (AEO) — Design Spec

**Date:** 2026-06-27 (refined via `/grilling` 2026-06-28)
**Status:** Approved (pending spec review)
**Author:** George Diab (with Claude)

## Summary

Add an "agent layer" to every blog post that serves **two** distinct audiences:

1. **A human handing the post to their agent** — a `Read ⟷ 🤖 Agent` toggle plus a
   mid-post banner. The agent view offers ready-to-run prompts whose **primary**
   action copies a self-contained payload (prompt + full post markdown) to the
   clipboard, so it works in *any* agent — browsing-capable or not. ChatGPT/Claude
   deep-links are a secondary convenience.
2. **An autonomous/crawling agent** that arrives at the post via web research or is
   handed the URL — it gets an **effective authored summary** (`agentSummary`),
   surfaced in the `.md` output, JSON-LD `abstract`, and the agent panel.

Inspired by Every's "Read this report with your agent" feature, adapted into an
open (no-login) in-place toggle suited to a personal blog.

### Why copy-first (key grilling decision)

The original idea was to embed the post's `.md` URL in each prompt and let the
agent fetch it. Problem: a large share of agents readers actually use **can't or
won't fetch a URL** (ChatGPT free/no-browsing, fresh `claude.ai` chat with web
off). That failure mode — *"I can't open that link"* — looks broken. So the
**primary** copy action bundles the full markdown inline (always works); the
`.md`-URL form is kept only for the secondary deep-links, which target
browsing-capable agents.

## Goals

- Every post is usable by an agent with zero per-post work (generic default
  prompts + `description` fallback for the summary).
- A human can copy a self-contained prompt+post into any agent in one click.
- A crawling agent gets an authored, effective summary that shapes how the post is
  represented and cited.
- Posts can override/extend prompts and summary via optional frontmatter.
- One prompt drafts a shareable LinkedIn post to drive traffic back to the post.
- AI authors the per-post fields at authoring time (via a `/aeo` skill); George
  never hand-writes them.
- Backfill `agentSummary` + `agentPrompts` into 2026 posts; older years fall back.

## Non-Goals

- No gating/login (unlike Every — keep it open).
- No backfill of pre-2026 posts (they ride fallbacks).
- No visible human-facing TL;DR — `agentSummary` is agent-facing only; the Read
  view is visually unchanged.
- No AI in the build or commit pipeline — generation happens at authoring time and
  is committed as static frontmatter.
- No new npm/runtime dependencies for generation (use a Claude Code skill, not the
  SDK).
- Pre-commit warn hook: **deferred** to a later iteration.

## Architecture

### Components

1. **`src/content.config.ts`** — extend the blog schema with two optional fields:
   ```ts
   agentSummary: z.string().optional(),       // 2–3 sentence authored TL;DR (~60 words)
   agentPrompts: z.array(z.string()).optional(), // tailored prompts; else generic defaults
   ```

2. **`src/consts.ts`** — add `AGENT_TOOLS` config so deep-link endpoints are easy
   to update:
   ```ts
   export const AGENT_TOOLS = {
     chatgpt: { label: "ChatGPT", base: "https://chatgpt.com/?q=" },
     claude:  { label: "Claude",  base: "https://claude.ai/new?q=" },
   };
   ```

3. **`src/utils/agentMode.ts`** — pure helpers:
   - `getAgentPrompts({ post, mdUrl, postUrl }): AgentPrompt[]`
     Returns custom prompts (`post.data.agentPrompts`) if present, else the generic
     default set. Each item: `{ label, text, copyPayload, linkPayload }` where
     - `copyPayload` = `text + "\n\n---\n\n" + fullMarkdown` (primary copy action),
     - `linkPayload` = `text + "\n\nSource: " + mdUrl` (secondary deep-links).
     The LinkedIn prompt additionally embeds the human `postUrl` in its `text`.
     **The LinkedIn share prompt is always present** (single source of truth,
     `getLinkedInPrompt(postUrl)`): it sits at #3 in the default set and is
     *appended* to custom prompts, so every post can drive traffic regardless of
     whether the author wrote custom prompts. (See Post-implementation refinements.)
   - `getAgentSummary(post): string` — returns `post.data.agentSummary` or falls
     back to `post.data.description`.
   - `buildAgentLinks(linkPayload): { chatgpt: string, claude: string }`
     URL-encodes against each `AGENT_TOOLS` base.

4. **`src/components/AgentMode.astro`** — receives `prompts`, `summary`, `mdUrl`,
   `postUrl`, `markdown`. Renders:
   - The toggle (accessible `role="tablist"`, Read / Agent tabs). **Read is
     default.** Full-swap: Agent hides the article and shows the panel.
   - The agent panel: the `agentSummary` at top, one card per prompt — **primary
     "Copy" button** (copies `copyPayload`) + secondary "ChatGPT" / "Claude"
     deep-links (use `linkPayload`) — plus a top-level "Copy post (markdown)"
     button and a "View raw markdown" link to `mdUrl`.
   - The mid-post CTA banner markup (hidden container; positioned by JS).
   - Inline client `<script>`: tab toggle, clipboard copy with feedback, `#agent`
     hash activation (deep-link into Agent view), and injecting the CTA banner near
     the middle paragraph of `#article`.

5. **`src/layouts/PostDetails.astro`** — compute absolute `mdUrl` and `postUrl`,
   call `getAgentPrompts()` / `getAgentSummary()`, pass `post.body` as `markdown`,
   render `<AgentMode>` (toggle above `#article`; the existing article markup is
   wrapped so the toggle can show/hide it). Pass `agentSummary` into
   `<StructuredData>` as well (see #7).

6. **`src/pages/posts/[...slug].md.ts`** — two changes:
   - Key `getStaticPaths` slug off `getPath(post.id, post.filePath, false)` instead
     of raw `post.id`, so the `.md` URL always matches the canonical HTML URL.
   - Prepend the summary to the response body as a TL;DR block:
     `> **TL;DR:** <agentSummary or description>\n\n` followed by the raw markdown.

7. **`src/components/StructuredData.astro`** — add schema.org `abstract` to the
   `BlogPosting` object, populated from `agentSummary` (fallback `description`).

8. **`src/pages/llms.txt.ts`** — add a single header instruction line teaching
   agents the markdown trick, e.g.:
   `> Append \`.md\` to any post URL for clean markdown (e.g. /posts/<slug>.md).`
   Per-post lines stay as concise one-liners with **HTML** links (citation-correct).

9. **`/aeo` Claude Code skill** (repo-local, e.g.
   `.claude/skills/aeo/SKILL.md`) — instructs the agent: read a given post, write a
   2–3 sentence `agentSummary` and 2–4 tailored `agentPrompts` (reader's voice)
   into its frontmatter. No SDK, no API key, no build/commit coupling — the agent
   already in the editor does the authoring; output is committed static frontmatter.

### Default prompts (generic, on every post)

Voice: the reader's ("me"/"my").

1. **Summarize** — "Read the linked post and give me the core argument in 5
   bullets, then the one idea most worth remembering."
2. **Make it actionable** — "Turn this post into a step-by-step checklist I could
   actually follow this week."
3. **Draft a LinkedIn post** — "I just read this post by `<author>` and want to
   share it on LinkedIn. First, interview me about my honest reaction — what stood
   out, why it matters to me, how it connects to my own work — asking ONE short
   question at a time and waiting for my answer before the next (about 3 questions,
   and follow up if an answer opens something up). Once you've heard me out, write a
   brief LinkedIn post in my voice that shares this as something I read and
   recommend — NOT something I wrote or did myself. Base it on my answers, keep it
   to a few tight lines, and close by crediting `<author>` and linking to the
   original (`<postUrl>`) so people can read the full post." (See Post-implementation
   refinements for why this is interview-style rather than auto-summarize.)
4. **Apply to me** — "Ask me 3 questions about my situation, then tell me how the
   ideas in this post apply to me specifically."
5. **Go deeper** — "What did this post assume or skip that I should understand?
   List the open questions and what to read next."

Copy payload per prompt = `text + "\n\n---\n\n" + fullMarkdown` (self-contained).
Deep-link payload = `text + "\n\nSource: " + mdUrl`. The LinkedIn prompt embeds the
author name (`SITE.author`) and human `postUrl` in its text so the drafted post
credits the author and links to the canonical page.

### Mid-post banner copy

> **Would you rather read this with an agent?**
> Grab ready-to-run prompts in a copy-ready version. →

JS-injected near the middle of `#article`, shown only in Read view,
non-dismissible, lightweight. Its button flips to Agent view (sets `#agent`).

### Data flow

```
PostDetails.astro
  ├─ mdUrl    = new URL(getPath(...) + ".md", site)
  ├─ postUrl  = computedCanonicalURL
  ├─ summary  = getAgentSummary(post)              // agentSummary ?? description
  ├─ prompts  = getAgentPrompts({ post, mdUrl, postUrl })
  ├─ <StructuredData ... abstract={summary} />
  └─ <AgentMode prompts summary mdUrl postUrl markdown={post.body} />
        ├─ server-rendered summary + prompt cards (work w/o JS; good for SEO)
        └─ client script: toggle + copy + #agent hash + mid-post banner injection
```

The mid-post banner is injected by JS into `#article`, so it never lives in the
markdown and does not leak into the raw `.md` / agent content.

## Authoring convention (CLAUDE.md)

Add to the project `CLAUDE.md` publishing notes:

- Posts may include `agentSummary` (2–3 sentence TL;DR) and `agentPrompts`
  (2–4 tailored prompts, reader's voice) in frontmatter.
- When drafting/publishing a post, run the `/aeo` skill to generate both fields;
  review and commit them. Omit either field to fall back (summary →
  `description`, prompts → generic defaults).

## Backfill scope

Run `/aeo` to add **both** `agentSummary` and `agentPrompts` to the 14 posts in
`src/content/blog/2026/`. Older years (2011–2022) get neither and degrade via
fallbacks (summary → `description`, prompts → generic defaults). Older posts can be
upgraded later, post-by-post, with the same skill.

## Edge cases

- **Agent can't fetch URLs:** the primary copy action bundles full markdown inline,
  so it works regardless of browsing capability. Deep-links (URL form) are
  secondary and target browsing-capable agents only.
- **No JS:** summary, prompts, and links render server-side; Read view is the
  default visible state, so the post is fully readable. Copy buttons degrade to
  selectable text.
- **URL parity:** fixed by aligning the `.md` route to `getPath()`.
- **Missing fields:** `agentSummary` → `description`; `agentPrompts` → generic
  defaults. Every post always has a working agent layer.
- **Unlisted/draft posts:** follow existing route behavior; no special handling.

## Testing / verification

- `npm run build` passes.
- Spot-check one 2026 post (custom summary + prompts render) and one pre-2026 post
  (generic defaults + description-as-summary render).
- Confirm a post's `.md` link resolves (URL parity) and is prefixed with the TL;DR.
- Confirm `agentSummary` appears in the page's JSON-LD `abstract`.
- Confirm `llms.txt` carries the append-`.md` instruction line.
- Confirm the primary "Copy" yields prompt + full markdown; deep-links open ChatGPT
  /Claude with prompt + URL prefilled.
- Confirm the Read/Agent toggle (full-swap), `#agent` deep-link, and mid-post
  banner all work.

## Post-implementation refinements (2026-06-29)

Two deliberate changes made after the spec was approved, during local testing of
the merged feature. Both refine decisions the spec had left in tension.

1. **LinkedIn share prompt is always present (not just on default-prompt posts).**
   The spec had custom `agentPrompts` *fully replace* the default set, which
   silently dropped the share prompt — a stated goal ("drive traffic back to the
   post") — on exactly the 14 backfilled posts most likely to be shared. Resolved
   by extracting the prompt to a single source of truth (`getLinkedInPrompt`) and
   **appending it to custom prompts** (it already lived at #3 in the defaults, so
   default-prompt posts are unchanged and never duplicate it).

2. **LinkedIn prompt interviews the reader instead of auto-summarizing.** The
   original text ("summarize my takeaways in my voice") caused readers' drafts to
   claim the *reader* performed the author's first-person results (e.g. "I ran the
   tool and got these numbers" — actually the author's). Reworked so the prompt
   **interviews the reader one question at a time** about their own reaction, then
   drafts a post that **shares the piece as something they read and recommend**
   (explicitly *not* something they wrote or did), crediting the author by name
   (`SITE.author`) and linking back. This makes attribution correct and the share
   genuinely the reader's.

## Deferred

- Non-AI pre-commit warn check ("post has no `agentSummary` — run `/aeo`").
- Headless/CI generation via `@anthropic-ai/sdk` (only if unattended generation is
  ever needed).
- Backfilling `agentSummary`/`agentPrompts` for pre-2026 posts.
- Additional deep-link targets (Perplexity/Gemini) — trivial to add via
  `AGENT_TOOLS`.
