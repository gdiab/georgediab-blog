---
title: "What Made Claude Code Click for Me"
description: "Remember and Superpowers didn't make Claude Code feel smarter. They made it more practical by reducing friction around context, planning, and execution."
pubDatetime: 2026-04-27T16:29:01-07:00
tags: ["ai", "developer-tools", "productivity", "engineering", "tools"]
draft: true
heroImage: "/posts/what-made-claude-code-click/hero.jpg"
---

I've been trying a lot of AI coding tools lately, and most of them fall into one of two buckets: impressive for five minutes, or actually useful for real work.

Two Claude plugins recently landed in the second bucket for me: [Remember](https://claude.com/plugins/remember) and [Superpowers](https://claude.com/plugins/superpowers).

What made them stand out wasn't that they suddenly turned Claude Code into some magical senior engineer. They helped with the parts around the code. Reloading context. Restarting sessions. Turning a rough idea into a workable plan. Keeping momentum once the work started.

That's what changed things for me.

## Remember fixed the part I was already tired of

One of the most annoying parts of using AI coding tools is session amnesia.

You make real progress, close the session, come back later, and suddenly you're re-explaining what you were doing, what files mattered, which decisions were already made, and what still felt risky. Even when the model is strong, that repeated setup work grinds on you.

Remember helps with that.

According to its plugin page, it automatically captures Claude Code sessions, summarizes them into daily memory logs, and reloads relevant context when you start a new session. The [`/remember`](https://github.com/Digital-Process-Tools/claude-remember) handoff command is the part I touch most directly, but the bigger value is the automatic pipeline running underneath it.

In practice, that means I can restart fresh and get back to work without feeling like I lost the thread.

That sounds small until you've been deep in a project for a while. Then it starts to matter a lot.

It also changes the feel of the tool. Claude Code starts acting a little less like a stateless assistant and a little more like a collaborator that actually remembers what you've been doing.

I also like the constraint. Remember is project-scoped. I don't want one giant AI brain dragging baggage from one repo into another. I want it to remember the work that belongs to *this* project, *this* codebase, and *this* set of decisions.

There are a couple practical gotchas. You need to disable auto-compact for it to work properly, and it uses Haiku in the background for summarization, so there is a small API cost. The [README](https://github.com/Digital-Process-Tools/claude-remember) is pretty direct about both, which I appreciated.

Looking at the repo reinforced the same impression I got from using it. It feels narrow on purpose. Hooks, handoffs, local memory, continuity. It is focused on one pain point, and that's part of why it works.

## Superpowers helped more with process than output

Superpowers solved a different problem for me.

A lot of AI coding frustration isn't about whether the model can write code. It's about getting from a vague idea to a clean execution path without doing all the orchestration yourself.

Superpowers adds a more structured workflow on top of Claude Code. Per its plugin page, it includes skills for brainstorming, test-driven development, systematic debugging, subagent-driven development, and code review.

Calling it a plugin is technically correct, but it undersells what it is. [Superpowers](https://github.com/obra/superpowers) is closer to a methodology layered on top of your coding agent. The [original release post](https://blog.fsck.com/2025/10/09/superpowers/) makes that pretty clear, and the repo does too.

The biggest change for me was planning.

I had been using Spec Kit for a while. It was useful, and I still think it has value, but Superpowers has mostly replaced it for me. The planning flow feels more detailed. There's more back and forth. It asks better questions. It pushes the idea around before jumping into implementation. And the artifacts it produces have felt more readable, while still being specific enough to build from.

That balance matters. A planning artifact should help you move, not make you feel like you just opened a 14-page compliance document.

The execution side is solid too. Superpowers can help break work up, run parallel agents, review what they produce, and push a stricter RED-GREEN-REFACTOR loop than I usually get by default. Claude Code starts feeling more operational. Less like a very smart autocomplete, more like a system with an actual workflow.

It is also unapologetically opinionated. The workflows are not presented as gentle suggestions. That's part of the value. If you're already tired of re-inventing your own planning and execution loop every session, that structure feels useful instead of heavy.

## Why they work well together

These plugins do different jobs, which is why I don't feel any pressure to choose between them.

Remember handles continuity.

Superpowers handles process.

Put them together and Claude Code becomes a lot more usable for actual engineering work.

That's the real point. I don't think either plugin matters because it makes Claude smarter in some abstract sense. What mattered to me was the friction they removed from the surrounding workflow.

And that's where a lot of AI coding tools still fall down.

The hard part usually isn't getting code out of the model. It's everything around that moment. Maintaining context. Recovering from interrupted sessions. Planning the work cleanly. Keeping quality up while moving quickly.

These two plugins helped with those problems more than most of the flashy stuff I've tried lately.

## The part I still don't love

I don't want to oversell any of this.

This corner of the tooling world changes constantly. Something that feels like my go-to today might get replaced in four to six months. That's just part of the deal right now.

There's also real overhead in keeping up. Every new plugin, harness, slash command, or framework promises a better loop. Sometimes it delivers. Sometimes it just adds more ceremony and another layer you have to learn, debug, and trust.

There is a broader engineering concern too. The faster these tools help us move, the more discipline we need around review, dependency trust, security scanning, and incident response. Better workflow doesn't remove those responsibilities. If anything, it raises the standard.

So no, I don't think Remember and Superpowers are the final form of anything. This space moves too fast for that kind of certainty.

But they did point me toward something real.

The most useful improvements I've found in AI coding lately haven't come from raw model jumps alone. They've come from reducing friction around the work itself.

For me, these two did that in different ways. And that made Claude Code a lot more practical than it was before.
