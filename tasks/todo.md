# SEO / GEO Audit — georgediab.com

Branch: `seo-geo-audit`. Method: build → crawl `dist/` (106 HTML pages, 104 sitemap URLs) → rank by expected impact → fix highest-leverage → rebuild/re-crawl → repeat.

## Baseline (what's already strong)
- Crawlable: `robots.txt` permissive + sitemap reference (confirmed live). Sitemap index + 104 URLs, per-type priority/changefreq.
- Per-page meta: title, description, canonical, full OpenGraph + Twitter card, article timestamps. Canonical on every page (except `/archives`).
- Structured data: `BlogPosting` (wordCount, readingTime, author, dates), `Person`, `WebSite` + SearchAction. JSON-LD on every page except `/archives`.
- Dynamic per-post OG images (satori). Pagefind search. RSS + autodiscovery.
- Citations: 20/33 posts carry inline `Source:` links — strong GEO signal.
- Content: descriptive H2s, exactly 1 H1/page, no missing img alt.

## Ranked gaps (impact × leverage)

| # | Gap | Dimension | Impact | Effort |
|---|-----|-----------|--------|--------|
| 1 | **No post-to-post internal links / no related-posts module** — body cross-links ≈ 0; crawl graph is shallow, no topical clustering, nothing passes authority or keeps AI engines inside a topic cluster | Internal links | High | Med (code) |
| 2 | **Meta descriptions truncated** on flagship 2026 posts: ai-identity-crisis 224, ai-native-shift 220, trying-bumblebee 194, i-built-a-tui 171 chars (cut ~155-160 in SERP + AI snippet) | Titles/answer-first | High | Low (prose) |
| 3 | **Titles >60 chars** on flagship posts: linkledger 79, ai-native-shift 75, remember-superpowers 75, entire-cli 71, rubber-duck 72 (truncated in SERP) | Titles | Med-High | Low (prose) |
| 4 | **No `llms.txt`** — emerging GEO standard for AI answer engines to find canonical content/index | GEO/citations | Med | Low (code) |
| 5 | **No `BreadcrumbList` JSON-LD** — breadcrumbs render visually but not as schema | Structured data | Med-Low | Low (code) |
| 6 | **`/archives` page malformed** — builds with no `<html>` wrapper, no canonical/desc/JSON-LD (unlisted, sitemap-excluded, but still served) | Crawlability | Low | Low (code) |
| 7 | Duplicate meta description (site default) on homepage + `/posts` list + pagination pages | Indexation | Low | Low |

## Fix loop (each: fix → `npm run build` → re-crawl → verify → next)
- [ ] Decide prose-editing boundary (titles/descriptions) vs code-only
- [ ] Fix #1 highest-leverage gap
- [ ] Rebuild + re-crawl, confirm gap closed, no regressions
- [ ] Re-rank, repeat until no critical technical gap remains

## Benchmark note
Live search-rank + AI-answer-engine benchmarking is a noisy, multi-day signal (indexing lag); not reproducible in-session. The reproducible benchmark here = the `dist/` crawl (tag coverage, schema validity, length budgets, link graph). Live target-query spot-checks are best-effort snapshots, flagged as such.

## Review — fixes applied (all verified by re-crawl)

Loop ran to convergence: build → crawl → fix highest-leverage → rebuild → re-crawl, until the benchmark went green on every dimension.

1. **Internal links / related posts (was #1).** New `src/utils/getRelatedPosts.ts` (tag-overlap scoring, recency tiebreak, tops up so every post links onward) + `src/components/RelatedPosts.astro`, wired into `PostDetails.astro`. Result: 31/31 posts now expose 3 contextual internal links — the shallow crawl graph is fixed.
2. **Titles + descriptions (was #2/#3).** Trimmed 8 over-budget meta descriptions to ≤160 (6 flagship 2026 posts + 2 from 2014) and shortened the one title whose own text exceeded 60 chars (linkledger 79→70 rendered). Other long titles left intact — only the ` | George Diab` brand suffix overflows, which SERPs truncate harmlessly. Meaning/voice preserved.
3. **llms.txt (was #4).** New `src/pages/llms.txt.ts` generates `/llms.txt` (llmstxt.org format) listing all 33 posts + pages with canonical URLs and descriptions, for AI answer engines.
4. **BreadcrumbList JSON-LD (was #5).** Added `BreadcrumbList` to `StructuredData.astro`; emitted Home→Posts→Title on every post.
5. **Duplicate/bogus BlogPosting schema (found during re-crawl — highest-value fix).** `Layout.astro` had been emitting a 2nd BlogPosting on every post AND a bogus one (`datePublished:"undefined"`, `@type BlogPosting`) on every non-post page — the about page was literally typed as a blog article. Removed it; posts keep the richer `StructuredData` BlogPosting, homepage keeps WebSite+Person, about/tags/search now carry no false schema.
6. **/archives (was #6).** Non-issue: it `Astro.redirect("/404")`s when `showArchives:false` — the dist file is a meta-refresh stub, already sitemap-excluded. No action needed.

### Final benchmark (reproducible `dist/` crawl) — all PASS
- schema integrity: 31/31 posts = exactly BlogPosting + BreadcrumbList
- meta descriptions ≤160: 0 over
- internal links: 31/31 posts carry related-posts module
- canonical coverage: 0 non-redirect pages missing canonical
- no bogus schema: 0 pages with `datePublished:"undefined"`
- llms.txt present (33 posts), robots→sitemap ref intact, sitemap 104 URLs

### Priority query → answer-ready page map
Every flagship topic maps to one clear page (answer-first descriptions + descriptive H2s + inline source citations):
- "is AI only for engineers / AI-native shift" → `/posts/2026/ai-native-shift`
- "engineers' identity crisis with AI / grief" → `/posts/2026/ai-identity-crisis`
- "local-first memory layer for AI agents" → `/posts/2026/linkledger-cli-agent-memory`
- "second brain in plain text / markdown" → `/posts/2026/building-a-second-brain-in-plain-text`
- "Claude Code remember + superpowers plugins" → `/posts/2026/remember-superpowers-claude-code`
- "Entire CLI AI code attribution" → `/posts/2026/entire-cli-attribution`
- "GasTown multi-agent build a TUI" → `/posts/2026/i-built-a-tui-with-gastown`
- "Perplexity Bumblebee endpoint scanner" → `/posts/2026/trying-bumblebee`
- "rubber duck debugging" → `/posts/2022/every-developer-needs-a-rubber-duck-and-youre-the-one`

### Honest limitation on live engine benchmarking
Live search-rank and AI-answer-engine results are a multi-day, non-reproducible signal and these changes aren't deployed yet, so a live ranking comparison now would only reflect the pre-change site. The reproducible benchmark is the `dist/` crawl above; the query→page map is the GEO-readiness target. Recommend re-checking live presence ~1–2 weeks post-deploy via Search Console + spot AI-engine queries.

### Not done (deliberately, low impact)
- A few 2013/2014 historical post titles still render >60 chars; left as-authored (low traffic/priority, editorial).
- Duplicate site-default description on list/pagination pages (homepage, `/posts`, `/page/N`) — expected for list pages; low value to differentiate.
