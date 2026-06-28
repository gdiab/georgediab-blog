# Agent Experience Optimization (AEO) — Design Spec

**Date:** 2026-06-27
**Status:** Approved (pending spec review)
**Author:** George Diab (with Claude)

## Summary

Add an "agent layer" to every blog post: a `Read ⟷ 🤖 Agent` toggle at the top of
each post plus a compact CTA banner mid-post. The agent view surfaces ready-to-run
prompts (copy buttons + "Open in ChatGPT / Claude" deep links) and a pointer to the
post's raw markdown.

The core trick: each prompt embeds a link to the post's existing
`/posts/<slug>.md` route, so the reader's agent fetches the full post text itself.
This sidesteps URL length limits — deep links carry only the short prompt + URL,
and the agent does the reading.

Inspired by Every's "Read this report with your agent" feature, adapted into an
in-place toggle suited to a personal blog.

## Goals

- Every post is usable by an agent with zero per-post work (generic default prompts).
- Posts can override/extend prompts via optional frontmatter (`agentPrompts`).
- One prompt drafts a shareable LinkedIn post to drive traffic back to the post.
- Backfill tailored prompts into 2026 posts; older years use generic defaults.
- Document the convention so future posts get tailored prompts at authoring time.

## Non-Goals

- No gating/login (unlike Every — this is a personal blog, keep it open).
- No backfill of pre-2026 posts (they ride generic defaults).
- No new build dependencies; progressive enhancement only.

## Architecture

### Components

1. **`src/content.config.ts`** — extend the blog schema:
   ```ts
   agentPrompts: z.array(z.string()).optional(),
   ```

2. **`src/consts.ts`** — add `AGENT_TOOLS` config so deep-link endpoints are
   easy to update:
   ```ts
   export const AGENT_TOOLS = {
     chatgpt: { label: "ChatGPT", base: "https://chatgpt.com/?q=" },
     claude:  { label: "Claude",  base: "https://claude.ai/new?q=" },
   };
   ```

3. **`src/utils/agentMode.ts`** — pure helpers:
   - `getAgentPrompts({ post, mdUrl, postUrl }): AgentPrompt[]`
     Returns custom prompts (from `post.data.agentPrompts`) if present, otherwise
     the generic default set. Each returned item has `{ label, text, payload }`
     where `payload` is the full string copied / deep-linked (prompt + `Source:`
     line). Custom prompts (plain strings from frontmatter) get a derived short
     label and the same `Source:` line appended.
   - `buildAgentLinks(payload): { chatgpt: string, claude: string }`
     URL-encodes the payload against each `AGENT_TOOLS` base.

4. **`src/components/AgentMode.astro`** — receives `prompts`, `mdUrl`, `postUrl`.
   Renders:
   - The toggle (accessible `role="tablist"` with Read / Agent tabs).
   - The agent panel: short intro, one card per prompt (Copy button +
     "Open in ChatGPT" + "Open in Claude"), a "View raw markdown" link to
     `mdUrl`, and a "Copy all markdown link" affordance.
   - The mid-post CTA banner markup (hidden container; positioned by JS).
   - Inline client `<script>` for: tab toggle, clipboard copy with feedback,
     `#agent` hash activation, and injecting the CTA banner near the middle
     paragraph of `#article`.

5. **`src/layouts/PostDetails.astro`** — compute absolute `mdUrl` and `postUrl`,
   call `getAgentPrompts()`, render `<AgentMode>` (toggle above `#article`,
   banner container handled by the component's script). The existing article
   markup is wrapped so the toggle can show/hide it.

6. **`src/pages/posts/[...slug].md.ts`** — change `getStaticPaths` to key the
   slug off `getPath(post.id, post.filePath, false)` instead of raw `post.id`,
   so the `.md` URL always matches the canonical HTML URL.

### Default prompts (generic, on every post)

Voice: the reader's ("me"/"my"). Each is sent as
`<text>\n\nSource: <mdUrl>` except the LinkedIn prompt, which also embeds the
human `postUrl` for sharing.

1. **Summarize** — "Read the linked post and give me the core argument in 5
   bullets, then the one idea most worth remembering."
2. **Make it actionable** — "Turn this post into a step-by-step checklist I could
   actually follow this week."
3. **Draft a LinkedIn post** — "Write a LinkedIn post summarizing my takeaways
   from this in my voice — hook, 3 short takeaways, and end with a link to the
   original post (<postUrl>) so people can read it."
4. **Apply to me** — "Ask me 3 questions about my situation, then tell me how the
   ideas in this post apply to me specifically."
5. **Go deeper** — "What did this post assume or skip that I should understand?
   List the open questions and what to read next."

### Data flow

```
PostDetails.astro
  ├─ mdUrl   = new URL(getPath(...) + ".md", site)
  ├─ postUrl = computedCanonicalURL
  ├─ prompts = getAgentPrompts({ post, mdUrl, postUrl })
  └─ <AgentMode prompts mdUrl postUrl />
        ├─ server-rendered prompt cards (work w/o JS; good for SEO)
        └─ client script: toggle + copy + hash + mid-post banner injection
```

The mid-post banner is injected by JS into `#article` (around its middle
paragraph). It never lives in the markdown, so it does not leak into the raw
`.md` / agent content.

## Authoring convention (CLAUDE.md)

Add to the project `CLAUDE.md` publishing notes:

- New posts may include `agentPrompts: ["...", "..."]` in frontmatter (2–4
  tailored prompts in the reader's voice).
- When drafting/publishing a post, generate 2–3 tailored `agentPrompts` as part
  of the checklist. Omit the field to fall back to the generic defaults.

## Backfill scope

Add tailored `agentPrompts` to the 14 posts in `src/content/blog/2026/`. Older
years (2011–2022) keep the generic defaults — no change.

## Edge cases

- **No JS:** prompts and links render server-side; the Read view is the default
  visible state, so the post is fully readable. Copy buttons degrade to plain
  text the reader can select.
- **URL parity:** fixed by aligning the `.md` route to `getPath()`.
- **Long prompts in deep links:** payloads are short (prompt + one URL), well
  under URL limits; the agent fetches the full post from the `.md` link.
- **Unlisted/draft posts:** follow existing route behavior; no special handling.

## Testing / verification

- `npm run build` passes.
- Spot-check one 2026 post (custom prompts render) and one pre-2026 post (generic
  defaults render).
- Confirm a post's `.md` link resolves (URL parity).
- Confirm ChatGPT/Claude deep links open with the prompt prefilled.
- Confirm the Read/Agent toggle works and the mid-post banner appears.
```
