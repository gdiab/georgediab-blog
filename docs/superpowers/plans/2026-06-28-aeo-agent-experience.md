# AEO Agent Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every blog post an "agent layer" — a Read ⟷ 🤖 Agent toggle with copy-first ready-to-run prompts for humans handing the post to an agent, plus an authored summary surfaced to crawling agents via the `.md` route, JSON-LD `abstract`, and `llms.txt`.

**Architecture:** Two optional frontmatter fields (`agentSummary`, `agentPrompts`) feed pure helpers in `src/utils/agentMode.ts`. `PostDetails.astro` computes the absolute `.md` URL + canonical URL and renders a new server-rendered `AgentMode.astro` component (works without JS) whose inline script handles the toggle, clipboard copy, `#agent` deep-link, and mid-post banner injection. The agent-facing summary is fed in parallel to the `.md` route (TL;DR prepend), `StructuredData.astro` (`abstract`), and `llms.txt`. AI authors the per-post fields at authoring time via a repo-local `/aeo` Claude Code skill; output is committed as static frontmatter. No new runtime/npm dependencies, no AI in the build or commit pipeline.

**Tech Stack:** Astro (content collections, `astro:content`), TypeScript, Zod schema, Tailwind, Biome (lint/format), Pagefind (build). Verification is build-based — this repo has **no unit-test framework**.

## Global Constraints

Copied verbatim from CLAUDE.md and the design spec. Every task implicitly includes these.

- **Verify with `npm run build`** — **never run `npm run dev`** in agent mode (endless loop). `astro check` for types, `biome check src` for lint/format.
- **No unit-test harness exists.** This plan substitutes the writing-plans TDD code-test cycle with **build + `dist/` output assertions + targeted `grep`** per the project's CLAUDE.md mandate. (User CLAUDE.md overrides the skill's default test cycle.)
- **Use `gsed`, never `sed`.** Use latest deps; never downgrade. No new npm dependencies for this feature.
- **No AI in build/commit pipeline.** Generation is authoring-time only, via the `/aeo` Claude Code skill. No `@anthropic-ai/sdk`, no API key.
- **Do not create or edit blog-post *content*** without George's consent. The only post edits in scope are adding `agentSummary` / `agentPrompts` **frontmatter** to the 14 posts in `src/content/blog/2026/` (the agreed backfill scope). Pre-2026 posts are untouched and ride fallbacks.
- **Both new fields are optional with fallbacks:** `agentSummary` → `description`; `agentPrompts` → the 5 generic default prompts. Every post always has a working agent layer.
- **Copy-first.** Per-prompt primary action copies `prompt + "\n\n---\n\n" + full post markdown` (works in any agent, browsing or not). ChatGPT/Claude deep-links are secondary and use `prompt + "\n\nSource: " + <.md URL>`.
- **`agentSummary` is agent-facing only.** No visible human TL;DR; the Read view stays visually unchanged. Read is the default toggle state.
- **Prompt copy strings are exact** (see Task 2 default prompts and Task 5 banner copy) — copy verbatim from the spec.
- **Git:** commit messages must **not mention Claude/AI in the body text**, but **must keep** the `Co-Authored-By` and `Claude-Session` trailers. Conventional-commit style (`feat:` / `fix:` / `chore:`), matching the repo (commitizen + cz-conventional-changelog).

### Shared interface contracts (defined once, referenced by later tasks)

```ts
// src/utils/agentMode.ts — exported surface (Task 2)
export interface AgentPrompt {
  label: string;        // eyebrow shown on the card
  text: string;         // the prompt itself
  copyPayload: string;  // text + "\n\n---\n\n" + fullMarkdown  (primary Copy)
  linkPayload: string;  // text + "\n\nSource: " + mdUrl        (secondary deep-links)
}
export function getAgentPrompts(args: { post: CollectionEntry<"blog">; mdUrl: string; postUrl: string }): AgentPrompt[];
export function getAgentSummary(post: CollectionEntry<"blog">): string;
export function buildAgentLinks(linkPayload: string): { chatgpt: string; claude: string };

// src/consts.ts — exported surface (Task 1)
export const AGENT_TOOLS: {
  chatgpt: { label: string; base: string };
  claude:  { label: string; base: string };
};

// src/components/AgentMode.astro — Props (Task 5)
interface Props { prompts: AgentPrompt[]; summary: string; mdUrl: string; postUrl: string; markdown: string }
```

---

## Task Overview

| # | Task | Deliverable |
|---|------|-------------|
| 1 | Schema + `AGENT_TOOLS` config | Two optional frontmatter fields + deep-link endpoints |
| 2 | `agentMode.ts` pure helpers | `getAgentPrompts`, `getAgentSummary`, `buildAgentLinks` |
| 3 | `.md` route: parity + TL;DR | `.md` URL matches canonical; body prefixed with summary |
| 4 | JSON-LD `abstract` + `llms.txt` line | Crawler-facing summary + markdown-trick instruction |
| 5 | `AgentMode.astro` component | Toggle, prompt cards, banner, client script |
| 6 | Wire into `PostDetails.astro` | Compute URLs, render component, pass `abstract` |
| 7 | `/aeo` skill + CLAUDE.md note | Authoring-time generator + convention |
| 8 | Backfill 14 × 2026 posts | `agentSummary` + `agentPrompts` frontmatter |

---

### Task 1: Schema fields + `AGENT_TOOLS` config

**Files:**
- Modify: `src/content.config.ts` (blog schema `z.object({...})`, after `AIDescription`)
- Modify: `src/consts.ts` (append `AGENT_TOOLS` export at end of file)

**Interfaces:**
- Produces: optional `agentSummary?: string` and `agentPrompts?: string[]` on `CollectionEntry<"blog">["data"]`; `AGENT_TOOLS` export (shape in Global Constraints), re-exported through `@/config`.

- [ ] **Step 1: Add the two optional schema fields**

In `src/content.config.ts`, inside the `z.object({ ... })`, immediately after the line `AIDescription: z.boolean().optional(),` add:

```ts
      // Agent Experience (AEO) — both optional with fallbacks
      agentSummary: z.string().optional(), // 2–3 sentence authored TL;DR (~60 words); agent-facing only
      agentPrompts: z.array(z.string()).optional(), // tailored prompts; else generic defaults
```

- [ ] **Step 2: Add `AGENT_TOOLS` to consts**

At the end of `src/consts.ts`, append:

```ts
// Agent deep-link endpoints (secondary, browsing-capable agents).
// Edit here if a provider changes its prefill URL.
export const AGENT_TOOLS = {
  chatgpt: { label: "ChatGPT", base: "https://chatgpt.com/?q=" },
  claude: { label: "Claude", base: "https://claude.ai/new?q=" },
};
```

- [ ] **Step 3: Sync content types and verify the schema compiles**

Run: `npm run sync && npx astro check`
Expected: completes with **no errors** referencing `agentSummary`, `agentPrompts`, or `content.config.ts`. (Pre-existing unrelated warnings, if any, are acceptable — note them but do not fix in this task.)

- [ ] **Step 4: Verify `AGENT_TOOLS` is reachable through `@/config`**

Run: `node --input-type=module -e "const m = await import('./src/consts.ts').catch(() => null); console.log('skip-node-resolution-check')" 2>/dev/null; grep -n "AGENT_TOOLS" src/consts.ts`
Expected: `grep` prints the `export const AGENT_TOOLS` line. (Direct node import of a TS path-alias file isn't resolvable; the real reachability check is the build in later tasks. This step only confirms the export exists.)

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/consts.ts
git commit -m "feat: add agentSummary/agentPrompts schema fields and AGENT_TOOLS config

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011PnmgEgztJcTEH3d69FdWU"
```

---

### Task 2: `agentMode.ts` pure helpers

**Files:**
- Create: `src/utils/agentMode.ts`

**Interfaces:**
- Consumes: `AGENT_TOOLS` from `@/config` (Task 1); `CollectionEntry<"blog">` from `astro:content`.
- Produces: `AgentPrompt`, `getAgentPrompts`, `getAgentSummary`, `buildAgentLinks`, and `PROMPT_SEPARATOR` (exact contracts in Global Constraints).

- [ ] **Step 1: Create the helper module with full implementation**

Create `src/utils/agentMode.ts`:

```ts
import type { CollectionEntry } from "astro:content";
import { AGENT_TOOLS } from "@/config";

export interface AgentPrompt {
  label: string;
  text: string;
  copyPayload: string; // text + PROMPT_SEPARATOR + fullMarkdown (primary "Copy")
  linkPayload: string; // text + "\n\nSource: " + mdUrl       (secondary deep-links)
}

/** Divider between the prompt and the inlined post markdown in a copy payload. */
export const PROMPT_SEPARATOR = "\n\n---\n\n";

interface GetPromptsArgs {
  post: CollectionEntry<"blog">;
  mdUrl: string;
  postUrl: string;
}

/**
 * Generic default prompts shown on every post that doesn't define its own.
 * Voice: the reader's ("me"/"my"). The LinkedIn prompt embeds the canonical
 * post URL so the drafted post links back to the original.
 */
export function getDefaultPrompts(postUrl: string): { label: string; text: string }[] {
  return [
    {
      label: "Summarize",
      text: "Read the linked post and give me the core argument in 5 bullets, then the one idea most worth remembering.",
    },
    {
      label: "Make it actionable",
      text: "Turn this post into a step-by-step checklist I could actually follow this week.",
    },
    {
      label: "Draft a LinkedIn post",
      text: `Write a LinkedIn post summarizing my takeaways from this in my voice — hook, 3 short takeaways, and end with a link to the original post (${postUrl}) so people can read it.`,
    },
    {
      label: "Apply to me",
      text: "Ask me 3 questions about my situation, then tell me how the ideas in this post apply to me specifically.",
    },
    {
      label: "Go deeper",
      text: "What did this post assume or skip that I should understand? List the open questions and what to read next.",
    },
  ];
}

/**
 * Returns the prompt cards for a post. Uses `post.data.agentPrompts` if present
 * (labelled "Prompt 1..N" since custom prompts are bare strings), else the
 * generic default set. Each card carries a self-contained `copyPayload`
 * (prompt + full markdown) and a `linkPayload` (prompt + .md URL).
 */
export function getAgentPrompts({ post, mdUrl, postUrl }: GetPromptsArgs): AgentPrompt[] {
  const fullMarkdown = post.body ?? "";
  const custom = post.data.agentPrompts;

  const base =
    custom && custom.length > 0
      ? custom.map((text, i) => ({ label: `Prompt ${i + 1}`, text }))
      : getDefaultPrompts(postUrl);

  return base.map(({ label, text }) => ({
    label,
    text,
    copyPayload: text + PROMPT_SEPARATOR + fullMarkdown,
    linkPayload: `${text}\n\nSource: ${mdUrl}`,
  }));
}

/** Agent-facing summary: authored `agentSummary` or fallback to `description`. */
export function getAgentSummary(post: CollectionEntry<"blog">): string {
  return post.data.agentSummary ?? post.data.description;
}

/** URL-encodes a linkPayload against each provider's prefill base. */
export function buildAgentLinks(linkPayload: string): { chatgpt: string; claude: string } {
  const q = encodeURIComponent(linkPayload);
  return {
    chatgpt: AGENT_TOOLS.chatgpt.base + q,
    claude: AGENT_TOOLS.claude.base + q,
  };
}
```

- [ ] **Step 2: Type-check the module**

Run: `npx astro check`
Expected: no errors referencing `agentMode.ts`. (Confirms imports, `AGENT_TOOLS` reachability via `@/config`, and `post.data.agentPrompts`/`agentSummary` types from Task 1 all resolve.)

- [ ] **Step 3: Lint the module**

Run: `npx biome check src/utils/agentMode.ts`
Expected: no errors (auto-fix with `npx biome check --write src/utils/agentMode.ts` if formatting differs, then re-run).

- [ ] **Step 4: Commit**

```bash
git add src/utils/agentMode.ts
git commit -m "feat: add agentMode helpers for prompts, summary, and deep-links

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011PnmgEgztJcTEH3d69FdWU"
```

---

### Task 3: `.md` route — URL parity + TL;DR prepend

**Files:**
- Modify: `src/pages/posts/[...slug].md.ts` (full rewrite — small file)

**Interfaces:**
- Consumes: `getPath` from `@/utils/getPath`; `getAgentSummary` from `@/utils/agentMode` (Task 2).
- Produces: `.md` URL keyed off `getPath(post.id, post.filePath, false)` (parity with canonical HTML), body prefixed with `> **TL;DR:** <summary>\n\n`.

- [ ] **Step 1: Rewrite the route**

Replace the entire contents of `src/pages/posts/[...slug].md.ts` with:

```ts
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { getAgentSummary } from "@/utils/agentMode";
import { getPath } from "@/utils/getPath";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return posts.map((post) => ({
    // Key the slug off getPath (not raw post.id) so the .md URL always matches
    // the canonical HTML URL. Strip the leading "/" for the [...slug] param.
    params: { slug: getPath(post.id, post.filePath, false).replace(/^\//, "") },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: CollectionEntry<"blog"> };

  // Prepend an agent-facing TL;DR (authored agentSummary, else description).
  const summary = getAgentSummary(post);
  const body = `> **TL;DR:** ${summary}\n\n${post.body ?? ""}`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
```

- [ ] **Step 2: Build and locate the generated `.md` files**

Run: `npm run build && find dist/posts -name "*.md" | head`
Expected: build succeeds; `.md` files exist under year-nested paths, e.g. `dist/posts/2026/trying-bumblebee.md` — confirming parity with the canonical HTML path `/posts/2026/trying-bumblebee`.

- [ ] **Step 3: Confirm the TL;DR prepend**

Run: `head -n 3 dist/posts/2026/trying-bumblebee.md`
Expected: first line begins with `> **TL;DR:** ` followed by the post's `description` (no `agentSummary` exists yet — backfill is Task 8), then a blank line, then the post body.

- [ ] **Step 4: Confirm parity against the canonical path**

Run: `test -f dist/posts/2026/trying-bumblebee/index.html && test -f dist/posts/2026/trying-bumblebee.md && echo PARITY_OK`
Expected: prints `PARITY_OK` (both the HTML page dir and the sibling `.md` resolve at matching slugs).

- [ ] **Step 5: Commit**

```bash
git add src/pages/posts/\[...slug\].md.ts
git commit -m "fix: align .md route to canonical path and prepend agent TL;DR

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011PnmgEgztJcTEH3d69FdWU"
```

---

### Task 4: JSON-LD `abstract` + `llms.txt` instruction line

**Files:**
- Modify: `src/components/StructuredData.astro` (BlogPosting object)
- Modify: `src/pages/llms.txt.ts` (header `lines` array)

**Interfaces:**
- Consumes (StructuredData): an optional `abstract` on the `data` prop, passed by `PostDetails.astro` in Task 6.
- Produces: `abstract` key in BlogPosting JSON-LD (omitted when undefined); an append-`.md` instruction line in `llms.txt`.

- [ ] **Step 1: Add `abstract` to the BlogPosting schema object**

In `src/components/StructuredData.astro`, inside the `if (type === "BlogPosting")` object, immediately after the `description: data.description,` line, add:

```ts
    abstract: data.abstract,
```

(`JSON.stringify` drops keys whose value is `undefined`, so posts that never pass `abstract` emit no `abstract` key — safe.)

- [ ] **Step 2: Add the markdown-trick instruction line to `llms.txt`**

In `src/pages/llms.txt.ts`, in the `lines` array, replace this block:

```ts
    `Author: ${SITE.author}. Canonical site: ${SITE.website}`,
    "",
    "## Posts",
```

with:

```ts
    `Author: ${SITE.author}. Canonical site: ${SITE.website}`,
    "",
    "> Append `.md` to any post URL for clean markdown (e.g. /posts/<slug>.md).",
    "",
    "## Posts",
```

(Per-post lines keep their existing HTML links — citation-correct — unchanged.)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Confirm the `llms.txt` instruction line**

Run: `grep -n "Append \`.md\`" dist/llms.txt`
Expected: one match showing the instruction blockquote line between the author line and `## Posts`.

- [ ] **Step 5: Confirm JSON-LD still renders (abstract present once posts pass it)**

Run: `grep -o '"@type":"BlogPosting"' dist/posts/2026/trying-bumblebee/index.html | head -1`
Expected: prints `"@type":"BlogPosting"` (the JSON-LD block still emits; `abstract` will populate after Task 6 wires it in — verified there).

- [ ] **Step 6: Commit**

```bash
git add src/components/StructuredData.astro src/pages/llms.txt.ts
git commit -m "feat: add JSON-LD abstract field and llms.txt markdown instruction

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011PnmgEgztJcTEH3d69FdWU"
```

---

### Task 5: `AgentMode.astro` component

**Files:**
- Create: `src/components/AgentMode.astro`

**Interfaces:**
- Consumes: `AgentPrompt`, `buildAgentLinks` from `@/utils/agentMode` (Task 2). Props: `{ prompts: AgentPrompt[]; summary: string; mdUrl: string; postUrl: string; markdown: string }`.
- Produces: a self-contained component that renders the toggle + agent panel (server-rendered, works without JS) and a `<template>` for the mid-post banner; its inline script drives the toggle, clipboard copy, `#agent` activation, and banner injection into `#article`.

Design notes (decisions filling gaps the spec left open — not re-litigating locked decisions):
- Each card embeds its full `copyPayload` (prompt + full markdown) directly as a `data-copy` attribute. This keeps the util the single source of truth and the copy logic trivial; the extra HTML bytes are acceptable for a personal blog and don't pollute readable text (the panel is `hidden`). Astro auto-escapes the attribute.
- The toggle uses `role="tablist"` with two `role="tab"` buttons. The Agent panel is the only `role="tabpanel"`; "Read" toggles the existing `<article id="article">` visibility via the `hidden` attribute (the article element keeps its native role — acceptable, no DOM restructuring).
- The banner lives **inside** `#article` after injection, so it's automatically hidden in Agent view (when `#article` is hidden) — no extra show/hide logic.

- [ ] **Step 1: Create the component**

Create `src/components/AgentMode.astro`:

```astro
---
import { buildAgentLinks, type AgentPrompt } from "@/utils/agentMode";

interface Props {
  prompts: AgentPrompt[];
  summary: string;
  mdUrl: string;
  postUrl: string;
  markdown: string;
}

const { prompts, summary, mdUrl, markdown } = Astro.props;
---

<div class="agent-mode mb-6" data-agent-mode>
  <div role="tablist" aria-label="Reading mode" class="inline-flex rounded-md border border-border text-sm">
    <button
      type="button"
      role="tab"
      id="tab-read"
      aria-selected="true"
      aria-controls="article"
      data-mode-tab="read"
      class="px-3 py-1.5 rounded-l-md aria-selected:bg-accent aria-selected:text-background"
    >
      Read
    </button>
    <button
      type="button"
      role="tab"
      id="tab-agent"
      aria-selected="false"
      aria-controls="panel-agent"
      data-mode-tab="agent"
      class="px-3 py-1.5 rounded-r-md aria-selected:bg-accent aria-selected:text-background"
    >
      🤖 Agent
    </button>
  </div>

  <section
    id="panel-agent"
    role="tabpanel"
    aria-labelledby="tab-agent"
    hidden
    data-agent-panel
    class="mt-4 rounded-md border border-border p-4"
  >
    <p class="agent-summary text-foreground/90">{summary}</p>

    <div class="mt-4 flex flex-wrap items-center gap-3 text-sm">
      <button
        type="button"
        class="rounded bg-muted px-2 py-1 font-medium"
        data-copy={markdown}
        data-copy-label="Copy post (markdown)"
      >
        Copy post (markdown)
      </button>
      <a href={mdUrl} class="underline hover:opacity-75">View raw markdown</a>
    </div>

    <ul class="mt-4 space-y-3 list-none pl-0">
      {
        prompts.map((p: AgentPrompt) => {
          const links = buildAgentLinks(p.linkPayload);
          return (
            <li class="rounded-md border border-border p-3">
              <p class="text-xs uppercase tracking-wide text-foreground/60">{p.label}</p>
              <p class="mt-1">{p.text}</p>
              <div class="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <button
                  type="button"
                  class="rounded bg-accent px-2 py-1 font-medium text-background"
                  data-copy={p.copyPayload}
                  data-copy-label="Copy"
                >
                  Copy
                </button>
                <a href={links.chatgpt} target="_blank" rel="noopener" class="underline hover:opacity-75">
                  ChatGPT
                </a>
                <a href={links.claude} target="_blank" rel="noopener" class="underline hover:opacity-75">
                  Claude
                </a>
              </div>
            </li>
          );
        })
      }
    </ul>
  </section>

  <template data-agent-banner>
    <aside class="agent-banner my-8 rounded-md border border-dashed border-accent/60 p-4" data-pagefind-ignore>
      <strong>Would you rather read this with an agent?</strong>
      <span class="block text-foreground/80">Grab ready-to-run prompts in a copy-ready version.</span>
      <button type="button" class="mt-2 underline hover:opacity-75" data-agent-banner-cta>
        Open agent view →
      </button>
    </aside>
  </template>
</div>

<script>
  function initAgentMode() {
    const root = document.querySelector<HTMLElement>("[data-agent-mode]");
    const article = document.querySelector<HTMLElement>("#article");
    if (!root || !article) return;

    const tabRead = root.querySelector<HTMLButtonElement>("#tab-read");
    const tabAgent = root.querySelector<HTMLButtonElement>("#tab-agent");
    const panel = root.querySelector<HTMLElement>("[data-agent-panel]");
    if (!tabRead || !tabAgent || !panel) return;

    function showRead() {
      tabRead.setAttribute("aria-selected", "true");
      tabAgent.setAttribute("aria-selected", "false");
      panel.hidden = true;
      article.hidden = false;
      if (location.hash === "#agent") {
        history.replaceState(null, "", location.pathname + location.search);
      }
    }

    function showAgent() {
      tabRead.setAttribute("aria-selected", "false");
      tabAgent.setAttribute("aria-selected", "true");
      panel.hidden = false;
      article.hidden = true;
      if (location.hash !== "#agent") {
        history.replaceState(null, "", "#agent");
      }
    }

    tabRead.addEventListener("click", showRead);
    tabAgent.addEventListener("click", showAgent);

    // Clipboard copy with transient feedback for any [data-copy] button.
    root.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((btn) => {
      const label = btn.getAttribute("data-copy-label") ?? "Copy";
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(btn.getAttribute("data-copy") ?? "");
          btn.textContent = "Copied";
          setTimeout(() => {
            btn.textContent = label;
          }, 900);
        } catch {
          btn.textContent = "Copy failed";
          setTimeout(() => {
            btn.textContent = label;
          }, 900);
        }
      });
    });

    // Inject the mid-post banner near the middle of the article (Read view only;
    // it lives inside #article so it hides automatically in Agent view).
    const tpl = root.querySelector<HTMLTemplateElement>("[data-agent-banner]");
    if (tpl && !article.querySelector(".agent-banner")) {
      const node = tpl.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
      if (node) {
        const paras = article.querySelectorAll(":scope > p");
        const mid = paras.length ? paras[Math.floor(paras.length / 2)] : null;
        if (mid) {
          mid.insertAdjacentElement("beforebegin", node);
        } else {
          article.appendChild(node);
        }
        node.querySelector("[data-agent-banner-cta]")?.addEventListener("click", showAgent);
      }
    }

    // #agent deep-link activates the Agent view on load.
    if (location.hash === "#agent") {
      showAgent();
    }
  }

  initAgentMode();
  document.addEventListener("astro:page-load", initAgentMode);
</script>
```

- [ ] **Step 2: Type-check and lint**

Run: `npx astro check && npx biome check src/components/AgentMode.astro`
Expected: no errors referencing `AgentMode.astro`. (Auto-fix formatting with `npx biome check --write` if needed.)

- [ ] **Step 3: Commit**

```bash
git add src/components/AgentMode.astro
git commit -m "feat: add AgentMode component with toggle, copy-first prompts, and banner

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011PnmgEgztJcTEH3d69FdWU"
```

---

### Task 6: Wire `AgentMode` into `PostDetails.astro`

**Files:**
- Modify: `src/layouts/PostDetails.astro` (imports, frontmatter computations, BlogPosting `data`, render `<AgentMode>` above `#article`)

**Interfaces:**
- Consumes: `getAgentPrompts`, `getAgentSummary` from `@/utils/agentMode` (Task 2); `AgentMode` (Task 5); `abstract` accepted by `StructuredData` (Task 4); existing `postPath` / `computedCanonicalURL` already in the file.
- Produces: a fully rendered agent layer on every post page, plus `abstract` in the BlogPosting JSON-LD.

- [ ] **Step 1: Add imports**

In `src/layouts/PostDetails.astro`, in the frontmatter import block, add after the `import StructuredData from "@/components/StructuredData.astro";` line:

```ts
import AgentMode from "@/components/AgentMode.astro";
```

and after the `import { getPath } from "@/utils/getPath";` line:

```ts
import { getAgentPrompts, getAgentSummary } from "@/utils/agentMode";
```

- [ ] **Step 2: Compute the agent-layer values**

In `src/layouts/PostDetails.astro`, immediately after the existing block that computes `computedCanonicalURL` (the `const computedCanonicalURL = ... ;` statement), add:

```ts
/* ========== Agent layer (AEO) ========== */
const mdUrl = (
  Astro.site
    ? new URL(`${postPath}.md`, Astro.site)
    : new URL(`${postPath}.md`, Astro.url.origin)
).href;
const agentSummary = getAgentSummary(post);
const agentPrompts = getAgentPrompts({ post, mdUrl, postUrl: computedCanonicalURL });
```

(`postPath` = `getPath(post.id, post.filePath, true)` is already defined just above; reusing it keeps the `.md` URL aligned with the canonical path — matching the Task 3 route.)

- [ ] **Step 3: Pass `abstract` into the BlogPosting StructuredData**

In the `<StructuredData type="BlogPosting" data={{ ... }} />` call, add `abstract: agentSummary,` inside the `data` object, immediately after the `description,` line:

```astro
    data={{
      title,
      description,
      abstract: agentSummary,
      author,
```

- [ ] **Step 4: Render `<AgentMode>` above the article**

In `src/layouts/PostDetails.astro`, find the line `<article id="article" class="mx-auto prose mt-6 max-w-3xl">` and insert the component immediately **before** it:

```astro
    <AgentMode
      prompts={agentPrompts}
      summary={agentSummary}
      mdUrl={mdUrl}
      postUrl={computedCanonicalURL}
      markdown={post.body ?? ""}
    />
    <article id="article" class="mx-auto prose mt-6 max-w-3xl">
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Verify the agent panel, toggle, and prompts render server-side**

Run: `grep -c -e 'data-agent-mode' -e 'data-agent-panel' -e 'data-agent-banner' -e '🤖 Agent' dist/posts/2026/trying-bumblebee/index.html`
Expected: a non-zero count (each marker present) — confirms the toggle, panel, and banner template are server-rendered (works without JS).

- [ ] **Step 7: Verify default prompts and deep-links are present**

Run: `grep -o -e 'chatgpt.com/?q=' -e 'claude.ai/new?q=' -e 'Draft a LinkedIn post' dist/posts/2026/trying-bumblebee/index.html | sort -u`
Expected: all three strings appear — confirms `buildAgentLinks` output and the generic default prompts (no per-post override yet) render.

- [ ] **Step 8: Verify `abstract` now populates the JSON-LD**

Run: `grep -o '"abstract":"[^"]*"' dist/posts/2026/trying-bumblebee/index.html | head -1`
Expected: prints an `"abstract":"…"` pair (currently the `description`, since `agentSummary` is backfilled in Task 8).

- [ ] **Step 9: Lint**

Run: `npx biome check src/layouts/PostDetails.astro`
Expected: no errors (auto-fix formatting if needed).

- [ ] **Step 10: Commit**

```bash
git add src/layouts/PostDetails.astro
git commit -m "feat: wire AgentMode and JSON-LD abstract into post layout

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011PnmgEgztJcTEH3d69FdWU"
```

---

### Task 7: `/aeo` Claude Code skill + authoring convention

**Files:**
- Create: `.claude/skills/aeo/SKILL.md`
- Modify: `CLAUDE.md` (add an authoring-convention note under "Adding a new blog post")

**Interfaces:**
- Produces: a repo-local skill that, given a post path, writes `agentSummary` (2–3 sentences) and 2–4 tailored `agentPrompts` into that post's frontmatter. No SDK, no API key, no build/commit coupling.

- [ ] **Step 1: Create the skill**

Create `.claude/skills/aeo/SKILL.md`:

```markdown
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
```

- [ ] **Step 2: Add the authoring convention to CLAUDE.md**

In `CLAUDE.md`, under `1. **Adding a new blog post**:`, after the existing bullet `- Format tags as arrays: ...`, add:

```markdown
   - Optionally add `agentSummary` (2–3 sentence agent-facing TL;DR) and `agentPrompts` (2–4 reader-voice prompts) to frontmatter — run the `/aeo` skill to generate both, then review and commit. Omit either to fall back (summary → `description`, prompts → generic defaults).
```

- [ ] **Step 3: Verify the skill file is well-formed**

Run: `head -n 4 .claude/skills/aeo/SKILL.md && grep -n "agentSummary\|agentPrompts" CLAUDE.md`
Expected: the SKILL.md frontmatter block (`name: aeo`, `description: ...`) prints, and `grep` confirms the new CLAUDE.md bullet references both fields.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/aeo/SKILL.md CLAUDE.md
git commit -m "feat: add /aeo authoring skill and CLAUDE.md convention

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011PnmgEgztJcTEH3d69FdWU"
```

---

### Task 8: Backfill `agentSummary` + `agentPrompts` for the 14 × 2026 posts

**Files:**
- Modify (frontmatter only): all 14 posts in `src/content/blog/2026/`:
  `ai-identity-crisis.md`, `ai-is-an-abstraction-layer-not-the-end-of-software-engineering.md`, `ai-native-shift.md`, `building-a-second-brain-in-plain-text.md`, `entire-cli-attribution.md`, `fix-this-code.md`, `i-built-a-tui-with-gastown.md`, `linkledger-cli-agent-memory.md`, `mcp-skills-connectivity-expertise.md`, `remember-superpowers-claude-code.md`, `software-factory-levels.md`, `the-agents-are-idle.md`, `the-dark-factory.md`, `trying-bumblebee.md`

**Interfaces:**
- Consumes: the `/aeo` skill (Task 7) and the schema fields (Task 1).
- Produces: authored `agentSummary` + `agentPrompts` frontmatter on each 2026 post. (This is the agreed content scope — frontmatter only, body untouched.)

**Scope guard:** Only the 14 files above. Edit **frontmatter only** — never the body. Pre-2026 posts are out of scope and ride fallbacks.

- [ ] **Step 1: Generate fields for each post via `/aeo`**

For each of the 14 files, run the `/aeo` skill against it and insert the generated `agentSummary` + `agentPrompts` into that file's frontmatter, preserving all existing fields. (Process one post at a time; review each diff before moving on.)

- [ ] **Step 2: Confirm all 14 posts now carry both fields**

Run: `grep -L "agentSummary" src/content/blog/2026/*.md; grep -L "agentPrompts" src/content/blog/2026/*.md`
Expected: **no output** from either command (`grep -L` lists files *missing* the pattern; empty means all 14 have both fields).

- [ ] **Step 3: Confirm no post body was modified**

Run: `git diff --stat src/content/blog/2026/ && git diff src/content/blog/2026/ | grep -E '^\+' | grep -vE '^\+\+\+|agentSummary|agentPrompts|^\+\s*-\s' | grep -vE '^\+\s*"' | head`
Expected: the diff touches only frontmatter; spot-check that added lines are `agentSummary`/`agentPrompts` (and their list items), not prose. Manually review `git diff` for any file whose body changed and revert body edits.

- [ ] **Step 4: Build and validate schema acceptance**

Run: `npm run build`
Expected: build succeeds (Zod accepts the new fields on all 14 posts).

- [ ] **Step 5: Spot-check a custom post end-to-end**

Run: `head -n 3 dist/posts/2026/trying-bumblebee.md && grep -o '"abstract":"[^"]*"' dist/posts/2026/trying-bumblebee/index.html | head -1`
Expected: the `.md` TL;DR line now shows the **authored `agentSummary`** (not the description), and the JSON-LD `abstract` matches that `agentSummary`.

- [ ] **Step 6: Spot-check a pre-2026 fallback post**

Run: `PRE=$(find dist/posts -path '*/202[0-2]/*' -o -path '*/201*/*' | grep '/index.html' | head -1); echo "$PRE"; D=$(dirname "$PRE"); MD="${D#dist}.md"; head -n 1 "dist${MD}"`
Expected: a pre-2026 post's `.md` TL;DR falls back to its `description`, and its page still renders the generic default prompts (no override) — confirming graceful degradation.

- [ ] **Step 7: Commit**

```bash
git add src/content/blog/2026/
git commit -m "content: backfill agentSummary and agentPrompts for 2026 posts

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011PnmgEgztJcTEH3d69FdWU"
```

---

## Final Verification (after all tasks)

Run the full spec verification checklist:

- [ ] `npm run build` passes cleanly.
- [ ] A 2026 post renders custom `agentSummary` + tailored `agentPrompts` (Agent panel, `.md` TL;DR, JSON-LD `abstract`).
- [ ] A pre-2026 post renders generic default prompts + `description`-as-summary (fallbacks).
- [ ] A post's `.md` link resolves at the canonical year-nested path (URL parity) and is prefixed with `> **TL;DR:** …`.
- [ ] `agentSummary` appears in the page's JSON-LD `abstract`.
- [ ] `dist/llms.txt` carries the append-`.md` instruction line.
- [ ] Manual browser spot-check (the one step `npm run build` can't cover — run `npm run preview` and open a post):
  - Read ⟷ 🤖 Agent toggle full-swaps (Read default).
  - `#agent` deep-link opens Agent view directly.
  - Primary **Copy** yields `prompt + "\n\n---\n\n" + full markdown`; the "Copy post (markdown)" button copies the raw body.
  - ChatGPT/Claude deep-links open with `prompt + Source: <.md URL>` prefilled.
  - Mid-post banner appears in Read view near the middle paragraph; its CTA flips to Agent view.

---

## Self-Review (performed against the spec)

**Spec coverage** — every spec section maps to a task:
- Schema fields (`agentSummary`, `agentPrompts`) → Task 1.
- `AGENT_TOOLS` → Task 1. `agentMode.ts` helpers (`getAgentPrompts`/`getAgentSummary`/`buildAgentLinks`, copy/link payloads, LinkedIn `postUrl`) → Task 2.
- `.md` route slug parity + TL;DR prepend → Task 3.
- JSON-LD `abstract` → Tasks 4 (schema) + 6 (wiring). `llms.txt` instruction line → Task 4.
- `AgentMode.astro` (toggle, panel, summary, prompt cards, copy buttons, deep-links, "Copy post (markdown)", "View raw markdown", banner, client script: toggle/copy/`#agent`/banner injection) → Task 5.
- `PostDetails.astro` wiring (compute `mdUrl`/`postUrl`, call helpers, pass `markdown`, render component, pass `abstract`) → Task 6.
- `/aeo` skill + CLAUDE.md convention → Task 7. Backfill 14 × 2026 posts → Task 8.
- Default prompts (exact text), banner copy (exact text), data-flow, edge cases (no-JS server render, can't-fetch-URL → inline copy, URL parity, missing-field fallbacks) → covered across Tasks 2/3/5/6.

**Placeholder scan:** No TBD/TODO/"handle edge cases"/"add validation" placeholders; every code step shows complete code.

**Type consistency:** `AgentPrompt` (`label`/`text`/`copyPayload`/`linkPayload`), `getAgentPrompts`/`getAgentSummary`/`buildAgentLinks` signatures, `AgentMode` Props (`prompts`/`summary`/`mdUrl`/`postUrl`/`markdown`), and `AGENT_TOOLS.{chatgpt,claude}.base` are used identically in Tasks 2, 5, and 6.

**Adaptation noted:** The repo has no unit-test framework and CLAUDE.md mandates build-based verification, so the writing-plans TDD code-test cycle is replaced by `npm run build` + `dist/` assertions + `astro check`/`biome check`. The one thing the build can't verify — interactive toggle/copy/banner behavior — is covered by the manual `npm run preview` spot-check in Final Verification.

---

## Post-implementation refinements (2026-06-29)

Made during local testing after the 8 tasks merged into the branch. Task 2's
`getAgentPrompts`/`getLinkedInPrompt` code above reflects the *original* plan; the
shipped behavior was refined as follows (full rationale in the design spec's
"Post-implementation refinements" section):

1. **LinkedIn share prompt always present** — extracted to `getLinkedInPrompt()` and
   appended to custom-prompt posts (kept at #3 in the default set, no duplication),
   so all posts — including the 14 backfilled ones — can drive traffic.
2. **LinkedIn prompt reworked to interview the reader** one question at a time and
   frame the share as the reader recommending the author's post (crediting
   `SITE.author` + link), instead of auto-summarizing "my takeaways" — which had
   wrongly attributed the author's first-person results to the reader.

Shipped on the `feat/aeo-agent-experience` branch (PR #49) after the plan's 8 tasks.
