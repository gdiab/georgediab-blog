---
title: "I Let GasTown Build A Toggl TUI"
description: "I let GasTown build a Toggl TUI. Speed was impressive, but the bigger insight was watching a Mayor agent shift from solo coding agent to effective multi-agent coordinator."
pubDatetime: 2026-03-24T13:00:00-08:00
tags: ["ai", "agents", "gastown", "vibe-coding", "engineering", "tools", "open-source"]
draft: false
---

I let GasTown build a Toggl TUI, and it shipped fast. What got really interesting was watching the Mayor shift from solo coding to multi-agent coordination.

---

I'd been looking for an excuse to try [GasTown](https://github.com/steveyegge/gastown) for a while. A colleague built a native Linux [Toggl Track](https://toggl.com/track/) app, and a few of us thought a Toggl TUI would be awesome.

I'm always looking for a new project when looking to explore a new model, framework, or AI tool. So owning creating a Toggl TUI gave me this perfect test case: real project, blank repo, and a clear ask. I wanted to see whether GasTown would just generate code quickly, or actually run as a coordinated multi-agent system.

## What GasTown Is (Beyond "Claude with extra steps")

Steve Yegge built GasTown. If you know the name, it's probably from his legendarily long blog posts — the ones that rewired how a generation of engineers thought about platforms, language design, and organizational dysfunction. He spent years at Amazon and Google, then joined Sourcegraph (and later left in 2026), wrote a book called *Vibe Coding*, and somewhere in late 2025 shipped GasTown as an open-source orchestration layer for running fleets of AI coding agents.

His pitch: a single AI agent can code just fine. The problem is context windows running dry, lost state on restart, and no ability to parallelize. GasTown is the factory floor, not another coding assistant.

The core model is a hierarchy with roles/personas:

- **The Mayor** — your AI coordinator. It doesn't write code. Its job is to decompose work, spawn agents, track progress, and keep the convoy moving. You talk to the Mayor; the Mayor manages everyone else.
- **Polecats** — worker agents. Ephemeral sessions (they end when a task is done) but persistent identity and work history. Think staff engineers, not temps.
- **Beads** — the unit of work. Every task is a bead with an ID, a status, a dependency graph. [Beads](https://github.com/steveyegge/beads) is its own tool: a distributed, Dolt-powered issue tracker designed for agent consumption, not humans.
- **Convoys** — batches of beads grouped for coordinated delivery. The Mayor dispatches convoys; Polecats complete them.
- **Hooks** — git worktree-based persistent storage. When an agent session ends (crashes, times out, whatever), the work state survives. The next session picks up exactly where the last one left off.

The philosophy behind it is Yegge's *Desire Paths* approach to agent UX: watch what agents naturally try to do, then build the tool that matches those instincts. GasTown is designed so agents understand it without special training. It meets them where they are.

This is different from throwing Claude a spec and hoping. GasTown adds structure: the Mayor plans before anyone touches code, work is tracked in a ledger, every completion is auditable, and the whole thing scales. Yegge designed it to comfortably run 20-30 agents in parallel.

## v1: Mayor Goes Rogue, Ships Anyway

I gave the Mayor a spec: Go + Bubble Tea TUI for Toggl Track. Start/stop timer, manual entry, today's log. Cross-platform. Open-source-ready. Blank repo.

Before writing a single line, the Mayor did homework. Two parallel research agents: one hitting Toggl API docs, one reading real Bubble Tea and Bubbles source files to pin exact dependency versions. Then a full architecture plan — file tree, screen routing, data types, keyboard shortcuts, error handling, refresh strategy. Only after that did it start coding.

Seven minutes and twenty-four seconds later: 15 files, ~1,877 lines of Go, pushed and running. Setup wizard, live dashboard, real Toggl data, working keyboard shortcuts. We ran QA, found real bugs (form too tall for small terminals, no warning on timer override, README never committed), filed them back. All four fixed in 4 minutes 19 seconds. One more bug caught after that: height check not firing because `m.height` initializes to 0. Fixed immediately, one line.

Then I asked the Mayor a direct question: who actually built this? Did any Polecats do the work thus far?

It produced a full history table and then called itself out without any prompting:

> *"It was all me (Mayor) in this single session. No polecats were slung, no witness or refinery did code work. Ha — fair point. I should have been slinging work to polecats instead of doing everything myself. That's literally the anti-pattern the Mayor docs call out: filing beads 'for later' while doing everything yourself. I ate context doing it all directly when I could have parallelized across polecats and kept my window clean for coordination."*

It then wrote a note to its own memory to default to slinging work going forward.

So: v1 shipped. But it ran like a solo developer pretending to be a team. The Mayor ate the whole context window when it should have been managing a pipeline. Noted.

## v2: Mayor as Pure Coordinator

I immediately gave the Mayor a new feature: weekly view, showing time logged per day with drill-down into individual entries. Same prompt structure as before, plus one sentence: *"Please sling this work to polecats. Don't implement it directly yourself."*

The difference was immediate.

Instead of touching code, the Mayor spent its first minute doing project management:

- Woke up the rig
- Created 4 beads in parallel, one per phase
- Set up a dependency graph
- Slung the first bead to a Polecat named *furiosa*

The dependency graph it built was a real DAG (directed acyclic graph, if you want the CS term). Tasks mapped with explicit blockers:

- `tt-jbe` (API + data model) → must land first
- `tt-2rm` (week summary screen) → blocked on `tt-jbe`
- `tt-tx3` (day detail screen) → blocked on `tt-jbe`, runs parallel to `tt-2rm`
- `tt-bts` (wiring + README) → blocked until both screens merged

When `tt-jbe` merged, the Mayor dispatched the two screen beads simultaneously: `tt-2rm` to a Polecat (agent) named *furiosa*, `tt-tx3` to a fresh Polecat named *nux*. Two agents, two git branches, two isolated repo clones, two tmux sessions, running in parallel while the Mayor watched the convoy table.

![furiosa and nux working in parallel — the convoy table mid-flight](/posts/i-built-a-tui-with-gastown/screenshot-weekly-7-two-polecats.jpg)

842 lines added across 4 PRs. Weekly view, day detail drill-down, full test coverage. The Mayor wrote zero lines of app code.

After the feature landed, I asked if tests were written. The Mayor ran the suite, reported 14 passing, then flagged its own gap:

> *"No tests for the day detail screen. Want me to file a bead to add coverage there?"*

I replied: "yep."

Bead filed, rig started, work dispatched, new Polecat spawned. From one word.

At the end of the session I asked for a full history — every bead, every agent, every commit. The Mayor queried the Beads ledger and git log and delivered a sprint summary: 4 releases shipped (v0.1.2 to v0.2.3), 7 beads completed, 2 Polecats used (furiosa with 7 beads, nux with 1), 15 commits, 21 files changed. Then: *"Happy testing — let me know what you find."*

That's not too dissimilar to a PM closing out a sprint.

## The Honest Take

**What worked:**

The research-before-coding discipline was impressive. The Mayor read actual API docs and studied real Bubble Tea projects before writing a line. It's something I would normally do myself before asking an agent to work on something, so that saved me time. The architecture it produced was clean enough that bugs landed in obvious places and fixed fast. Human QA to AI fix cycles ran under 5 minutes.

The session handoff protocol is legitimately impressive. Between v1 and v2, the Mayor booted into a fresh session, checked its hook, found a self-written message from the previous session, read it, verified state, docked the rig, and reported in. All automatically, zero context loss. That's the thing GasTown is actually built for.

Self-correction happened without prompting twice: once when `go vet` flagged a self-assignment bug (the Mayor caught it, fixed it, committed clean), once when the Mayor voluntarily admitted the anti-pattern and adjusted. The system learns.

**What didn't:**

v1 ran as a solo agent wearing a coordinator hat. The full GasTown workflow (Mayor coordinates, Polecats build, ledger tracks everything) only emerged in v2 after an explicit nudge. If I hadn't asked "did you use Polecats?", I might not have gotten the real experience. The docs warn about this. Yegge calls it out directly. Worth reading before you start.

Setup has real prerequisites: Go, Git, Dolt, Beads, tmux, Claude Code CLI. This isn't `npm install` and go. Budget time for configuration.

**What surprised me:**

The audit trail. `bd show` reconstructs the entire history of a feature — every bead, every agent, every merge. On a real team, that's not a nice-to-have.

The Mayor's emotional intelligence, if I can call it that. It flagged its own gap on test coverage. It confessed to an anti-pattern. It wrote itself notes. That's not just task execution; it's a system that understands its own role.

## Go Try It

The TUI is real and installable: [github.com/gdiab/toggl-tui](https://github.com/gdiab/toggl-tui). Pre-built binaries for Mac, Linux, and Windows (though I've only tested on Mac, so feedback from Linux and Windows users is welcome). Go install works too. If something breaks, open an issue and I'll have the Mayor sling some beads. Or submit a PR and I'll review it.

If you want to run the experiment yourself:

- **GasTown**: [github.com/steveyegge/gastown](https://github.com/steveyegge/gastown)
- **Beads**: [github.com/steveyegge/beads](https://github.com/steveyegge/beads)

Yegge himself warns most developers should wait. It's early, it requires steering, it's still a bit of a "self-propelling slime monster" (his words). He's not wrong. But if you want to understand what agent orchestration actually looks like in practice, not in a demo, GasTown is the most honest example I've seen.

The Mayor gets the work done. It just works better when you let it manage a team of agents.
