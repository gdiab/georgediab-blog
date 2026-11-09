# Pull quotes

Use a pull quote to visually restress one line the reader has already seen, or as an opening dek that frames the post. The treatment lives in `src/styles/typography.css` and works in ordinary `.md` posts via a small HTML snippet. Do not invent a second style for an individual post.

## When to use one

- One per post is usually enough. Pick the sentence that carries the argument, not a decorative aside.
- Mid-article pull quotes should repeat a line that already appears in the body, close to where it was said.
- Opening deks (the italic lede used in several 2026 posts) can use the same visual class even when the line does not appear again. In that case the line is unique content, not decoration.
- Do not use a pull quote for someone else's words. Those stay in a markdown blockquote (`>`), which keeps the existing left accent/50 border and slightly faded text.
- Do not use a pull quote for new information, labels, stats, or headings. Those belong in `<aside class="post-callout">`.

## Markup to copy

Repeating a line from the body (screen readers should not hear it twice):

```html
<aside class="pull-quote not-prose" aria-hidden="true">
  <p>Some stay as they are, some I adapt, and some I write myself.</p>
</aside>
```

Opening dek, or any pull line that does not already appear in the body (keep it readable to assistive tech):

```html
<aside class="pull-quote not-prose">
  <p>AI doesn't reduce your cognitive load. It concentrates it.</p>
</aside>
```

Put a blank line before and after the aside. Write the sentence as plain text inside the `<p>`; the CSS italicizes it. The `not-prose` class keeps Tailwind Typography from treating it like a body paragraph.

## What it looks like

Larger Atkinson Hyperlegible italic, left-aligned, with a short terracotta accent rule above and below. The quote is about 1.5× body size on desktop (`1.875rem` against `lg:prose-xl` body at `1.25rem`) and about 1.25× on smaller screens (`1.25rem` against default `.prose` body at `1rem`), with line-height 1.3. No card, no background, no "FROM THE POST" label, no quotation marks, and no full-width horizontal rules. The rules use `--accent` and the text uses `--foreground`, so light and dark themes follow the site palette.

This sits between the two treatments we rejected:

- Plain italic sandwiched between markdown `---` rules, which reads as a section break rather than a designed quote.
- A navy image card with a label, which is too busy for a line that is already in the post. Styled excerpt cards are for skill or code excerpts, not for pull quotes.

It is also distinct from neighboring components:

| Element | Job | Visual cue |
| --- | --- | --- |
| `blockquote` | Other people's words | Full-height left border at `accent/50`, 80% opacity |
| `.post-callout` | New editorial info | 3px solid accent bar, body size, optional label |
| `.pull-quote` | Emphasize our own line | 1.5× / 1.25× italic, short accent ticks top and bottom |

## Do

- Keep the sentence short enough to scan: one or two lines, not a paragraph.
- Match the wording of the body line when the quote is a repeat. Do not paraphrase it into a new claim.
- Use `aria-hidden="true"` when the text is repeated, and omit it when the line is unique.
- Leave excerpt-image cards, figures, and callouts alone; they are different objects.

## Don't

- Don't wrap the line in markdown `*` or `_` inside the `<p>`.
- Don't put the quote in a `<blockquote>`. That style is reserved for citations.
- Don't add quotation marks, drop caps, backgrounds, borders-as-boxes, or a kicker label.
- Don't follow an opening `.pull-quote` with a leftover `---` divider. The short accent rules already separate it from the body.
- Don't introduce a second display font for quotes. Atkinson Hyperlegible italic is the site typeface; 400-italic is already loaded.
- Don't create a one-off style in the post file. Change `typography.css` if the standard needs to evolve.

## Posts to migrate later

These still use the older italic-then-horizontal-rule pattern (an italic paragraph immediately after frontmatter, followed by `---`). Do not edit them until a dedicated pass. When they are migrated, replace the italic line and the following `---` with the snippet above, and omit `aria-hidden` because each line is unique opening copy rather than a repeat.

- `src/content/blog/2026/the-agents-are-idle.md` — "AI doesn't reduce your cognitive load. It concentrates it."
- `src/content/blog/2026/the-feedback-loop-you-didnt-know-you-needed.md` — "Stop screenshotting your agent's work back at it. Point at the thing, say the thing, and it lands in the agent's context as structure."
- `src/content/blog/2026/fix-this-code.md` — "Three words pulled a frontier model off the internet. The export control disarmed the people it was meant to protect."
- `src/content/blog/2026/your-senior-isnt-behind-theyre-untrained.md` — "The skill is spending fewer tokens, not more. Mandate the opposite and the skeptic who resists is the one reading it right."

`src/content/blog/2026/one-job-per-skill.md` is the reference implementation (mid-article repeating quote, with `aria-hidden="true"`).
