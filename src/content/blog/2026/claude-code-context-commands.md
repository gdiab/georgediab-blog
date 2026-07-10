---
title: "Four Claude Code Commands for Managing Context"
description: "Branch, fork, background, and btw each send Claude Code work somewhere else, keeping side questions, experiments, and long runs out of one giant session."
pubDatetime: 2026-07-09T17:04:07-07:00
tags: ["ai", "developer-tools", "engineering", "agents", "tools"]
draft: false
agentSummary: "Claude Code has four commands that route conversation context differently: /branch copies the whole session into an independent one you switch into (original preserved, resumable). /fork spawns a background subagent that inherits your full context, works while you keep going, and returns only its result. /background detaches the entire session via a local daemon so you exit and get your terminal back. /btw asks a read-only side question that sees your context, has no tools, and never enters the transcript. The point isn't memorizing four commands, it's having a mental model for where context goes so you spend it deliberately."
agentPrompts:
  - "I'm deep in a Claude Code session and want to try a riskier approach without losing my current path. Should I use /branch or /fork, and why?"
  - "Explain the difference between /fork and /background in terms of what happens to my current session and my terminal."
  - "When would /btw be the right choice over just asking Claude the question normally in the session?"
  - "Help me build a habit for keeping Claude Code sessions from ballooning, using these context commands deliberately."
---

Claude Code has four commands that all deal with the same problem: what to do with your context when you want to go somewhere without wrecking the session you're already in.

Context is the scarce resource now. The model is usually good enough. What runs out is the room in the window and your own attention, and both get worse when everything you do piles into one long session. The four commands are `/branch`, `/fork`, `/background`, and `/btw`, and they each move your context to a different place. They look similar from a distance, and they're easy to mix up until you see where the context lands in each one.

<img src="/posts/context-management-commands/Claude Code Commands-selection.png" alt="A decision-tree diagram titled 'Useful Claude Code commands' for choosing what to do mid-session in Claude Code. It asks what kind of detour this is, then maps quick side questions to /btw, side tasks to /fork, risky alternate paths to /branch, and long-running work to /background." class="w-full rounded-xl" />

Here's the same thing in words.

## `/branch` copies the session so you can try another path

`/branch` takes your conversation at the current point, copies it into a new independent session, and switches you into that copy. The original doesn't go anywhere. It's preserved, and you can return to it with `/resume`.

Each branch is its own session with its own context window, so the two don't share a budget or step on each other. That's the whole appeal. You've built up a lot of useful context, you want to try a direction you're not sure about, and you don't want to lose the good state you're in if it goes sideways. Branch, explore, and if the branch was a dead end, resume the original like nothing happened.

## `/fork` sends a subagent off with your full context

`/fork <directive>` spawns a background subagent that inherits your full conversation, then works on the directive while you keep going in the main session. When it finishes, its result comes back to you as a message. The subagent's own tool calls stay out of your transcript, so you get the answer without the mess of how it got there cluttering your context. I like to think of it as a command to send Claude Code on a side quest so it doesn't risk the main quest.

What makes it a fork and not a plain subagent is that inherited context. Say the side quest is "debug this new bug I found on the feature we just finished building." A cold subagent would need all that background re-explained. A fork already has it.

## `/background` hands the session off and frees your terminal

`/branch` and `/fork` both leave you working. `/background` is the one where you leave.

It detaches the entire current session to keep running in the background, via a local daemon, and frees your terminal. Nothing is copied or split here. The whole session moves, and you exit it. You get your prompt back to do something else, and you reattach later with `claude agents` or `/resume` to see where it got.

This is for the long-running task you don't want to babysit. A big review, a large refactor, something that's going to churn for a while. Send it to the background and get on with your day. Worth knowing that this one arrived with agent view as a research preview, so it's the newest and least settled of the four.

## `/btw` asks a question that never hits the transcript

`/btw` is the lightest of the group and the odd one out. It doesn't create a session, copy anything, or move you anywhere.

You ask a quick side question, and the answer shows up in a dismissible overlay. It sees your full loaded context, so it can answer from what Claude already knows. But it has no tool access, and it never enters the conversation history. `c` copies the answer, and the arrow keys step back through earlier ones.

It's the inverse of a subagent. A subagent has full tools and starts with an empty context. `/btw` has your full context and no tools. Reach for it when you want a fast "wait, what was that config file called again" without spending a real turn and padding the transcript with it.

## The Wrap Up

The mental model that keeps them straight is just how far the context travels and whether you go with it.

`/btw` doesn't move anything and you stay put. `/fork` sends a copy off to work and you stay put. `/branch` copies everything and you move into the copy. `/background` moves the whole session and you leave with it. Cheapest to heaviest, roughly in that order.

Most days I only need two of them. A quick `/btw` to check something without derailing, and a `/branch` when I want to try an approach I might throw away. The other two earn their place on bigger work.

## Sources

Everything above was checked against the official Claude Code documentation and release notes on 2026-07-09:

- [Claude Code commands reference](https://code.claude.com/docs/en/commands.md) — behavior of `/branch`, `/fork`, `/background`, and `/btw`, and the note that `/fork` was an alias for `/branch` before v2.1.161
- [Claude Code sessions docs](https://code.claude.com/docs/en/sessions.md) — branching, resuming, and session independence
- [v2.1.187 release notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.187) — `/btw` arrow-key navigation (the `c`-to-copy shortcut landed in v2.1.186)
- Agent view, which `/background` is built on, shipped as a research preview in v2.1.139 (May 2026)
