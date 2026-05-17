---
title: "Building a Second Brain in Plain Text"
description: "What I learned building a markdown second brain with Tolaria, git, and an AI collaborator that helps with capture and structure instead of writing the notes for me."
pubDatetime: 2026-05-17T09:00:00-07:00
tags: ["ai", "tools", "productivity", "software-engineering"]
heroImage: "/posts/building-a-second-brain-in-plain-text/hero.jpg"
draft: false
unlisted: true
---

A few weeks ago, Andrej Karpathy [posted](https://x.com/karpathy/status/2039805659525644595) about using LLMs to build personal knowledge bases.

The pattern is pretty simple: put raw documents in one folder, have an LLM compile a markdown wiki from them, then ask the wiki questions instead of digging through the original material. In his case, the research wiki had 100 articles and roughly 400K words of LLM-generated content, and he rarely touched it directly.

Within days, implementations were everywhere. Karpathy [shared a gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) with the canonical pattern. Blog posts and forks started showing up all over the place. The three I sat with longest were a [Medium writeup](https://medium.com/@markchen69/i-used-claude-code-to-build-a-personal-knowledge-base-inspired-by-karpathys-llm-wiki-pattern-6a81a9661d49) from someone who built two domain wikis in an hour with Claude Code, an [academic-research fork](https://github.com/MetamusicX/llm-research-wiki) of the pattern, and a more polished Go binary called [sage-wiki](https://github.com/xoai/sage-wiki).

I read a chunk of them, skimmed a pile of repos doing variations on the idea, sat with the pattern for a couple of days, and decided to try something different.

## The two bets

The Karpathy pattern rests on one premise. From his gist:

> "The tedious part of maintaining a knowledge base is not reading or thinking. It's the bookkeeping."

If you accept that premise, the LLM-as-compiler approach makes sense. The bookkeeping is the friction. Automate the friction and the wiki becomes the LLM's domain.

I'm not sure I accept the premise. The bookkeeping is annoying, but it isn't the part I want help with. The part I want help with is capture friction and structural judgment. Reddit blocks fetchers. X paywalls everything. LinkedIn gates content. Notes need to land somewhere useful. Hubs need to emerge at the right time, not because I got excited after saving one article.

Those are the places where a smart collaborator saves me effort. The writing is what I want to keep, because that's the value, not the cost.

So I'm running a different bet. I author the notes. The AI handles capture friction and helps me think about structure. I keep the wiki small and the structure intentional, and I let the AI suggest where things should go instead of generating the things themselves.

I don't know yet if this is the better bet. The vault is still young, and the way it feels right today might not survive a month of real use. But it's a real choice with real costs on both sides. Plenty of people are running the LLM-as-compiler bet and getting value out of it. Mark Chen's two-domain-wiki writeup is one I keep coming back to. He took the bet I didn't, and from his account it works.

This isn't me arguing that everyone else is wrong. It's me explaining why I chose the other path.

## What I picked

I ended up using [Tolaria](https://github.com/refactoringhq/tolaria), a desktop app for managing markdown knowledge bases. Tolaria is AGPL-3.0, built and maintained by Luca Rossi, the writer behind the [Refactoring newsletter](https://refactoring.fm/). He uses it for his own vault, which matters to me because tools built from real use usually have different instincts.

The app is a UI on top of plain files: notes with YAML frontmatter, wikilinks for connections, and saved views as YAML files in a `views/` folder. The vault is grep-able, editable in any text editor, and survives any future tool migration because it's just text and folders. The same vault works without Tolaria. The app is a viewer and editor, not a database.

I picked it for two specific reasons. First, the companion app gave me a useful interface without trapping the data. I could have built my own viewer against whatever folder structure I chose, and at some point I probably would have, but Tolaria already understood the conventions I wanted. Second, it's git-native out of the gate. Obsidian never stuck with me. The git story was part of why. It has options, but the product wants to sell you on paid sync instead. Tolaria treats every vault as a git repo by default. I liked that, and the decision got easier.

## The system grew with the agent

I started with one generic Bookmark type and nothing else. No hubs, no views, no conventions.

About ten saves in, recurring themes started showing up: tools I wanted to evaluate, AI industry news, blog-idea fodder, prompt templates worth trying. Each became a hub when the pattern earned it, not before.

The agent's job here was watching the cluster, not naming it. `tools-to-try` was the first hub. `ai-news` came next. When a tool turned up that I'd already adopted in my daily setup, we promoted it into its own hub called `tools-i-use`: same shape as `tools-to-try`, different lifecycle position.

Other potential hubs got declined. I saved a Medium post on engineering management, a topic I obviously care about, and the agent's call was:

> If engineering-management becomes a recurring theme for you, the same hub-note + view pattern would apply, but with N=1 I wouldn't create a hub yet.

The same afternoon, it made the opposite call for a disciplined ChatGPT prompt I saved:

> This is the first prompt artifact, but you've shown sustained interest in this space. I'd predict more prompt artifacts coming.

It created `prompt-templates`. Same heuristic, two opposite outcomes. That was the important part. The agent was weighing pattern density, not reflexively spawning structure.

## The inbox almost became a junk drawer

The strongest moment of the experiment came from a near-miss. I had an Anthropic post I wanted to read soon and almost left it `_organized: false` to keep it in my inbox as a reminder. The agent pushed back:

> The inbox is going to fight you over time. The inbox is for "I haven't decided where this goes." If you also use it for "I want to act on this soon," they bleed together, and as more notes pile up, "act soon" notes get camouflaged by genuinely-unfiled ones. The signal degrades exactly when you need it most.

Right. The inbox is for unfiled notes. Action discovery happens through saved views, not through inbox staleness.

That turned into a vault-level convention immediately:

> The inbox, meaning notes lacking `_organized: true`, is for "I haven't decided where this goes yet." Action discovery happens through saved views in `views/*.yml`. Don't conflate the two.

That one rule probably saved the system from becoming useless.

## Capture friction is real work

A lot of the content I want to save lives behind some kind of fetcher block. Reddit returns 429s to anonymous fetchers with empty user agents. X requires API access. LinkedIn gates most content beyond public previews. Each time we hit a wall, we solved it once and codified the workaround.

These started as one-off fixes in chat. The useful question became: where should each fix live? The agent's framing was simple:

> "Could a stranger using this vault on their own machine sensibly use this?" Put it in the vault instructions. "Does it only make sense with my exact account names, Keychain entries, or install paths?" Keep it in private memory.

That distinction matters. A Reddit fetch pattern is portable. A local token location is not. A convention about when to create hubs belongs in the repo. A personal path on my machine does not.

That's the kind of boring rule that makes an AI-assisted system safer over time. The workarounds for capture friction and the rules for agent behavior share the same origin: something went wrong once, then got codified.

## The conventions are load-bearing

Some of the best rules came from corrections, not design. At one point, the agent marked a paywalled Pragmatic Engineer post as `read` because it had hydrated the body. I corrected it. I hadn't personally read the source yet.

That became a rule:

> The `status` field tracks whether I have personally read the source. It does not track whether the agent enriched the bookmark.

That seems like a small rule. It isn't. A second brain is only useful if the metadata means what you think it means. If `read` starts meaning "an agent fetched it," the system eventually lies to you.

The whole thing only works because the agent treats my conventions as load-bearing. It doesn't toggle Tolaria-managed state on its own. It doesn't create hubs without asking. When I asked it to track a personal savings goal in a git-tracked vault, it flagged that the file would live in repo history forever and laid out options before touching anything.

Without that posture, the system would drift into something I couldn't trust.

## Rules that have held up

If you're building your own version of this, these are the rules that have held up best:

- Default to N=2 before creating a hub. Resist spawning structure at N=1.
- The inbox is for unfiled notes only. Action discovery happens through saved views.
- `status` reflects whether you personally read the source, not whether an agent enriched it.
- Ask before structural moves: hub creation, file deletion, schema changes.
- Codify durable patterns into repo instructions. Keep machine-specific details in private memory.

That can sound abstract until the numbers start moving. In a little over a week, this vault grew to more than 225 notes and roughly 90,000 words of source material captured, enriched, and structured with AI help: saved articles, hydrated source notes, summaries, prompts, tool evaluations, and hub notes that tie related material together.

The value isn't in writing every note myself. It's in building a system that captures, organizes, and resurfaces the material faster than I could manage by hand.

## Plain text made customization boring

The whole vault is plain text, so customization is mostly a matter of deciding what to write down.

Frontmatter is just YAML. Add a field, and the agent can read it. Future views can filter on it. Tolaria rendered custom fields as first-class properties in the sidebar without me doing anything special.

![Tolaria rendering custom YAML frontmatter fields as sidebar properties](/posts/building-a-second-brain-in-plain-text/tolaria-frontmatter.png)

A note can sit in multiple hubs at once. A bookmark can be linked to both `tools-to-try` and `blog-ideas` by listing both in `related_to`. It shows up in both saved views without being duplicated. That was the moment I realized tags and categories are the wrong primitives for this system. The right primitive is "what is this related to," which is just a list.

Lifecycle is whatever I write down. `status: unread` to `read` to `archived` for bookmarks. `tried: false` to `tried: true` plus a verdict for prompt templates. Nothing enforces these conventions except the notes themselves, but that has been enough because I'm the one running the system.

Views are filters, not folders. The same note appears in multiple views. Nothing has to be moved to appear in a new context. This is the design decision that killed the urge to over-organize.

## What I found when I looked inside

A few days in, I asked what else Tolaria could do besides edit files. I expected to find some kind of search index, because tools that maintain indexes usually need a way to recover when the index falls out of sync.

There isn't one. Search is a naive case-insensitive substring scan over every Markdown file on each call. No tokenization, no inverted index, no embeddings, no semantic ranking. At 50 notes it's invisibly fast. At 50,000 it would likely crawl. That's a real ceiling.

But the interesting part is what that ceiling does not break. The vault has no proprietary state: no derived index, no embeddings, no database. Search is therefore a swappable surface. If I outgrow the in-app search before Tolaria ships a better one, the immediate low-friction answer is [ripgrep](https://github.com/BurntSushi/ripgrep). More serious indexed-search options would be something like [SQLite FTS5](https://www.sqlite.org/fts5.html) or [Meilisearch](https://www.meilisearch.com/docs) pointed at the same folder.

A sibling Markdown app like [Obsidian](https://obsidian.md/) or [Logseq](https://logseq.com/) is a different kind of escape hatch. Not necessarily better search at scale, but another editing and navigation layer that can sit on the same files without a migration.

Tolaria does bundle its own MCP server inside the desktop app, but it is intentionally limited. It exposes tools to search a note, read a note, get vault orientation, open a note in the running UI, highlight a UI element, and trigger a rescan. None of them writes. The agent's authoring path is the same as a human's: edit a file on disk. Tolaria's UI monitors the filesystem and detects the change on its own.

That matters because the app is not trying to become the source of truth. It closes the loop with the running UI, so a note I just created appears in my tab bar without me alt-tabbing, but the substrate stays plain text.

That is the test for this kind of tool: when one feature of the host falls behind, can you route around it without migrating data? If you can, the bet held. If you're trapped, the bet failed.

## The hard parts are still hard

This setup is working, but it still has rough edges. The line between "this deserves a hub" and "this is a one-off" is genuinely hard at N=1. I've made the call both ways in the same session and won't know which was right for months.

Personal data in a git-tracked vault wants explicit thought: per-file gitignore, subfolder gitignore, or accept that history is permanent in a private repo. There's no clean default.

Multi-`related_to` is great for discoverability and bad for navigation overload. A note in five views shows up in five contexts, which can be useful or noisy depending on what I'm trying to find. I haven't fully resolved this, and I expect the agent to keep evolving the relationships as we use the system more. Finding over-linked notes is exactly the kind of tending I want it doing.

## What I think this is really about

I started this experiment thinking I was choosing a note app. I don't think that's the interesting part anymore. The interesting part is the substrate: plain text, git, clear conventions, and an AI collaborator that respects the boundaries of the system.

That also changes where the collaborator can live. Claude Code's [Remote Control](https://code.claude.com/docs/en/remote-control) lets me drive a session running on my laptop from my phone, an iPad, or any browser. The local environment stays where it is. API access, MCP servers, and the vault itself stay on the laptop. Only the input surface changes. The same pattern extends to OpenClaw or another agent, as long as repo hygiene stays boring: pull before changing, commit intentionally, push when done.

The LLM-wiki pattern says: let the model compile the knowledge base for you. My bet is different: let the model reduce the friction around capture, retrieval, and structure, while I keep authorship and judgment close to me.

Maybe that changes later. Maybe the vault gets big enough that I want more generated summaries, more compiled views, or more automation than I want today. But right now, the system feels useful because it bends to me instead of asking me to bend to it.

This is the version of a second brain I actually want: not a giant generated wiki I occasionally query, but a plain-text working memory I can shape with a collaborator sitting next to me.
