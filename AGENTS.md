# AGENTS.md

Agent workflow guidelines for working in this repo.

## Blog post creation (drafts -> PR)

### Consent + scope
- **Do not create a new post unless George explicitly asks for a post draft** (e.g. “write a blog post about X”).
- When asked to draft: create a **draft post** (title + body), open a PR, and let George do the final pass + merge.

### Pre-flight questions (keep it lightweight)
If the request doesn’t specify these, ask 1–3 quick clarifiers:
- Target audience (engineers? EMs? execs?)
- Desired angle (practical guide vs opinion vs case study)
- Any must-include sources/links or personal anecdotes

### Branch + file placement
- Branch name: a short **kebab-case slug** derived from the title/topic.
- New post path: `src/content/blog/<YYYY>/<slug>.md`.
- Images (if needed): `public/posts/<slug>/...` and reference via `/posts/<slug>/...`.

### Frontmatter requirements
- Always include at least:
  - `title`
  - `description`
  - `pubDatetime` in ISO-8601 with offset (`YYYY-MM-DDTHH:MM:SS+HH:MM`) using **current time**
  - `tags` (array). **Do not omit tags.** Infer from the post; use existing tag patterns for consistency.
  - `draft: true` (until George merges/decides otherwise)
- Optional fields only when useful: `modDatetime`, `featured`, `unlisted`, `ogImage`, `heroImage`, `canonicalURL`, `timezone`, `source`.

### Drafting workflow (quality + rigor)
- Start with an outline and iterate section-by-section.
- **No hallucinated facts/quotes**. If a claim needs support:
  - add a source link, or
  - rephrase as opinion/experience, or
  - mark as TODO for research and do the research before finalizing.
- Prefer concrete examples, code snippets when relevant, and clear takeaways.
- If the topic is research-heavy, ask a second agent to:
  - verify claims,
  - suggest stronger framing,
  - add credible sources/evidence.

### Repo/tooling rules
- **Do not run `npm run dev`** in agent mode. Use `npm run build` or `npm run build:check`.
- When doing sed-style edits, use **`gsed`** (per CLAUDE.MD).

### PR checklist
Before opening the PR:
- Ensure the post renders (run `npm run build:check` if feasible).
- Ensure tags look consistent with existing posts.
- Check links are valid and sources are included where needed.
- Commit message should be clear (e.g. `draft: <title>`).
- Open PR with:
  - summary of angle
  - any open TODOs/questions for George
  - call out any sections where sourcing is thin
