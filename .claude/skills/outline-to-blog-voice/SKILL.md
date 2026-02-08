---
name: outline-to-blog-voice
description: Expand a rough blog outline or outline-like draft into natural, human-sounding prose in the author’s voice. Use when given outline-style sections, bullet lists, or terse paragraphs that need to read like a real blog post for engineers learning a new technique.
---

# Outline to Blog Voice

## Inputs to Gather

- Target draft sections to expand.
- One or two recent posts by the same author in the repo to match tone and cadence.

## Workflow

1. Identify the section’s core claim in one sentence.
2. Expand bullets into full sentences and short paragraphs without changing meaning.
3. Add one concrete consequence or example after each major claim.
4. Add a short transition sentence between paragraphs to keep momentum.
5. Replace mirrored-contrast patterns with plain statements plus a consequence.

## Voice and Style Constraints

- Write like a pragmatic engineer explaining a real system.
- Prefer concrete outcomes over abstractions.
- Keep sentences tight but not choppy.
- Avoid mirrored-contrast patterns like “X, not Y” or “this, not that.”
- Avoid “just don’t” or “simply” unless it’s truly simple.
- Keep the tone confident and practical, not hypey.

## Anti-Patterns to Rewrite

- “X, not Y” → Write X, then describe the limitation or tradeoff plainly.
- “It does A, not B” → Write A, then say what you still need.
- “This makes things possible, not predictable” → Write what it enables, then what it still doesn’t guarantee.

## Output Format

Return the rewritten section(s) only. Do not change headings unless asked. Do not change meaning. Keep terminology consistent with the rest of the draft.

## Research and Sources

If the draft cites external standards, specs, or claims that need verification, read `references/research.md` and produce a short research note block per section before rewriting. Keep citations aligned to those sources. Add a TODO if a claim needs sourcing and the references do not cover it.

## Quality Check

- Each paragraph makes one clear point.
- At least one concrete example or consequence appears per section.
- The section reads like a blog post, not an outline.
