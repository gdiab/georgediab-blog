---
title: "Stop rebuilding agents. Start shipping skills."
description: "Agents are getting smarter, but reliability comes from packaging expertise as versioned, testable procedures. Skills are the missing layer."
pubDatetime: 2026-02-06T20:55:07-08:00
draft: true
tags: ["ai", "agents", "skills", "developer-productivity", "engineering-management"]
---

## The problem: smart agents, unreliable outcomes

Most of us have had the same experience with AI agents: they can be brilliant in bursts, and then deeply frustrating when you need them to do something the same way twice.

That frustration is not primarily a model intelligence problem. It’s a reliability and expertise problem.

An agent can write code, reason about tradeoffs, and stitch together a workflow. But when the work requires domain rules, organizational conventions, or “how we do it here” context, the agent often behaves like a genius intern seeing your world for the first time. You can coach it. You can paste in checklists. It might do a great job once. Then it drifts.

So the question becomes: how do we turn one-off brilliance into consistent execution?

A pragmatic answer is: stop rebuilding agents and start shipping skills.

## A mental model shift: the runtime is becoming universal

A lot of agent work is converging on a surprisingly universal base:

- a loop that manages context,
- a runtime that can read and write files,
- and the ability to execute code (bash, Python, etc.).

Once an agent can pull data from APIs, organize artifacts in a filesystem, run analysis, and generate outputs in standard formats, you don’t need a bespoke “agent” per domain. Code becomes the universal interface to the digital world.

But universality isn’t the same as expertise.

## Intelligence isn’t expertise

If you’re doing taxes, you don’t want a superhuman mathematician re-deriving the tax code from first principles. You want a tax professional who applies the rules consistently.

That’s the gap with many agents today. They’re capable, but not consistently aligned with the domain rules you actually care about.

## What a “skill” is (and why the simplicity matters)

In the simplest formulation, a skill is an organized folder that packages procedural knowledge an agent can reuse.

That’s intentionally unglamorous.

Folders are:

- easy for humans to create and review,
- easy to version in Git,
- easy to share across a team,
- and capable of holding both instructions and actual tools (scripts, templates, assets).

The key shift is that instead of asking the model to reinvent a workflow every time, you externalize the workflow as code and documentation. It can be executed, inspected, and improved.

If you notice the agent repeatedly writing the same helper script, that script should stop living as a transient idea in your chat history. It should live as a tool in a skill. Next time, you run it.

That turns prompting into productizing.

## Progressive disclosure: protect the context window

One of the most practical design choices in a skills-based approach is progressive disclosure.

At runtime, the agent only needs to know that a skill exists and what it’s for. It does not need every instruction and every script injected into context all the time.

So you expose lightweight metadata up front, and the agent pulls the full instructions only when it chooses to use the skill.

If you want an agent with dozens or hundreds of skills, this matters. The context window is finite and expensive. Progressive disclosure is how you keep a large capability surface without permanently bloating the prompt.

## Why skills create leverage for teams

Skills aren’t just a neat packaging trick. They change how teams operationalize AI:

- **Repeatability:** encode the happy path; reduce drift.
- **Guardrails:** embed checks, defaults, and required outputs.
- **Faster onboarding:** new engineers inherit a working library on day one.
- **Institutional knowledge:** procedures become versioned artifacts, not tribal lore.
- **Continuous improvement:** when a workflow fails, you update the skill and everyone benefits.

In other words, skills turn AI usage from “a conversation” into “a system.”

## How to start (without boiling the ocean)

Start with one workflow your team repeats weekly:

- writing release notes,
- preparing a metrics report,
- generating a PRD outline,
- incident comms,
- codebase migrations with your internal conventions.

Create a skill folder with:

1) a short README that lists triggers and expected outputs,
2) one script that does the repetitive part,
3) a small “golden output” example to sanity-check formatting.

Then use it for a week. The point is to create an improvement loop.

## Where this goes next

As skills mature, the obvious next step is to treat them like software:

- versioning and changelogs,
- review and ownership,
- testing and evaluation,
- dependency management.

The moment you have that, you have a path to something agents struggle with on their own: consistent execution of expertise over time.

## Source

- Video transcript source material: https://www.youtube.com/watch?v=CEvIs9y1uog
