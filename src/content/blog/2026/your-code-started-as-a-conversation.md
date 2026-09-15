---
title: "Your code started as a conversation"
description: "Engram indexes coding-agent transcripts so you can find why code exists, not just when it changed. How I use Mike Manzano’s open-source provenance tool, who it’s for, and where it still fails me."
pubDatetime: 2026-09-14T21:30:00-07:00
tags: ["ai", "agents", "tools", "developer-tools", "open-source", "software-engineering"]
draft: true
unlisted: false
agentSummary: "Personal field report on Engram, Mike Manzano’s local provenance index over coding-agent transcripts. Covers what it is (tapes, fingerprints, explain/grep/peek), how George uses it through agents (Tackle SPEC recovery, off-label memory, dispatch markers), who it’s for, and confirmed failures: text≠idea lineage, install cliffs, misuse-as-memory, Cursor adapter format drift (issue #19), and why semantic tools like funes are complementary."
agentPrompts:
  - "What problem does Engram solve that git blame cannot?"
  - "How does George actually query Engram day to day?"
  - "What is a dispatch marker and why use one on agent handoffs?"
  - "Where does Engram fail for George, including the Cursor adapter issue?"
  - "How is funes different from Engram, and why might you want both?"
---

Git is great at *what* changed and *when*. It is almost useless at *why*. Why does this rule exist? Which chat invented that name? When someone says "we already decided that," are they remembering or rewriting history?

Most of that "why" never lands in a commit message. It lives in the coding-agent sessions where you argued, pasted a link, changed your mind, and only later asked an agent to write the file. [Engram](https://github.com/clickety-clacks/engram) is Mike Manzano's open-source attempt to keep those sessions findable. This is how I use it, who it is for, and where it still fails me.

## What it is

Engram sits next to your agent logs. It watches the transcript directories you point it at (mine are Claude Code and Codex), turns matching files into immutable "tapes," fingerprints the text, and indexes the hashes in a local SQLite database. Ask about a file, a line range, or a phrase, and it returns the conversations that share that text, ranked, as short windows something else can read.

Mike built it in Rust (Apache 2.0). The design is stubborn on purpose. It stores raw facts and refuses to summarize what you "meant." No decision labels, no "this was the important meeting" badge, no account, no sync service. Sharing provenance is copying files. The README line I keep coming back to: the intended reader is another agent, not a human dashboard.

That last part matters. I almost never type `engram` into a terminal for myself. My agents do, when I ask where something came from instead of guessing.

## How I use it

The cleanest wins look like this. I point at a file and ask for its origin. The agent tries `engram explain` on a path or a span, falls back to `engram grep` when the wording is fuzzy, then `engram peek` to read more of a tape. When the thing was actually quoted, pasted, or edited in a conversation that still exists, the chain is real.

The cleanest recovery I have is from Tackle, a small agent harness I was sketching for myself. Its architecture spec is the example I trust. Git says the file showed up in early July. Engram walks vault sessions back to late June, to the moment I was wondering whether to build that harness, with confidence falling as you leave the repo and approach the original paste. That is the product working as advertised: the conversation that produced the artifact, not just the commit that checked it in.

I also use it for messier questions that are not really about code. A dotfile that appeared and vanished. An essay I typed into a form and later recovered from a Codex session. A weekly rollup that said "sent" while the transcript said otherwise. Engram was not built as a second brain. Running a lot of agents, with chat history that disappears, I use it that way anyway.

Lately I have started putting a tiny dispatch marker on handoffs between agents: one line, `<engram-src id="…"/>`, with a fresh UUID. The same string has to land in both the sending session and the receiving one. Fingerprints alone will not invent that link. Without it, the "why" chat and the "write the code" chat stay strangers even when they are about the same work.

## Who it is for

Engram is for people who already drown in agent transcripts and care more about cause than vibes.

If you run Claude Code or Codex across a few repos and keep asking "why is this like this," it beats archaeology by hand. If you are building something that orchestrates agents, the tapes and dispatch markers are a better starting point than rewriting a parser for every harness. If a team can drop tapes on a shared mount or into `.engram/tapes/` next to the code, provenance can travel with `git clone`.

Skip it if you want a pretty timeline UI. Skip it if your harness deletes history before you install a watcher. Skip it if the question you actually have is "remind me of the vibe of that decision." That last one is a meaning problem. Engram is a text problem.

## Where it fails (for me)

I checked these against my own index, not a README.

**Matching text is not matching the idea.** Fingerprints find shared words. Claude injects `CLAUDE.md` into every session, so `explain` on a rule's wording returns every session that ever saw the rule, at confidence 1.00. Correct as text search. Useless as an answer to "why did we add this." The birth of a rule usually happens under different words: a red commit, an admission, a "yes, add both lessons" later in the tape. You find that with grep and reading, or you do not find it at all.

**History starts when the watcher starts.** Engram cannot rebuild what the harness already pruned. My voice-profile file is the sharp case. `explain` named a session that only *read* the file. The interview that wrote it is older than the surviving transcripts. Install early, or live with a cliff.

**Some of the friction was me.** I have asked Engram to behave like a general memory layer or a status ledger: broad greps, short IDs, "what did we decide" hunts that were never its job. In that mode the watcher locks, queries time out, and agents thrash the CLI. That is real cost, but a fair amount of it is misuse. Engram is provenance over text. When I treat it that way, the sharp edges hurt less.

**Watching a folder is not the same as ingesting it.** Engram already has a Cursor adapter. I pointed the watcher at my Cursor agent-transcript directories. Every file came back skipped as a non-transcript. The adapter expects an older session shape; Cursor's current agent JSONL uses another. "Supported" on paper and "present in my index" are different claims. Format drift is its own cliff, next to the install one. I filed that as [issue #19](https://github.com/clickety-clacks/engram/issues/19).

**Semantic search is a different tool.** Something that embeds meaning would catch decisions born under different words. The closest public cousin I have looked at is Hugging Face's [funes](https://github.com/huggingface/funes). It would also be worse at "this span came from that session," because similarity is not causation. I want both. I do not want one ranking pretending to be both.

## What I am doing about it

None of this asks Engram to become a summarizer.

After a failure that earns a standing rule (a broken pipe in a test script, a bad merge habit), I now try to write the incident into the rule file or the PR the same day: what broke, when, and which session if I still have the id. That is for next month's me. Fingerprints will never invent that paragraph later.

On handoffs between agents, I stamp the dispatch marker so the chain can be walked on purpose. When an adapter quietly skips files, I treat it as a bug report (like [issue #19](https://github.com/clickety-clacks/engram/issues/19)), not a personal misconfiguration. Above the index I still want a thin layer that can brief an agent for the task at hand by reading windows in context. Engram stays the index. Meaning search, if I add it, sits beside fingerprints, not as a replacement.

## If you already wish git could answer why

Point a watcher at the transcript dirs you still have. Ask an agent to explain a file you actually care about. Prefer a span you discussed in chat, not a rule injected into every prompt. Give the index a few weeks of tapes before you decide.

The first time it returns a session you would not have found by scrolling, you will know whether this is your problem. If it never does, you still have git blame, and you have learned something useful: your questions were about ideas, not text.
