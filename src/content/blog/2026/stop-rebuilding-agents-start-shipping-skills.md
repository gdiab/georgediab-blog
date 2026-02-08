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

An agent can write code, reason about tradeoffs, and stitch together a workflow. But when the work requires domain rules, organizational conventions, or “how we do it here” context, the agent often behaves like a talented intern seeing your system for the first time. You can coach it. You can paste in checklists. It might do a great job once. Then it drifts.

That drift is what kills adoption. Teams will tolerate an occasional mistake from a human if the process is learnable and stable. They won’t tolerate a tool that changes its mind every week about what “good” looks like.

So the question becomes: how do we turn one-off brilliance into consistent execution?

A pragmatic answer is: stop rebuilding agents and start shipping skills.

## A mental model shift: the runtime is becoming universal

A lot of agent work is converging on a surprisingly universal base:

- a loop that manages context,
- a runtime that can read and write files,
- and the ability to execute code (bash, Python, etc.).

Once an agent can pull data from APIs, organize artifacts in a filesystem, run analysis, and generate outputs in standard formats, you don’t need a bespoke “agent” per domain. Code becomes the universal interface to the digital world.

That’s good news because it means you can reuse the same scaffolding across lots of problems. But it also makes a different limitation obvious.

## Intelligence isn’t expertise

If you’re doing taxes, you don’t want a superhuman mathematician re-deriving the tax code from first principles. You want a tax professional who applies the rules consistently.

That’s the gap with many agents today. They’re capable, but not consistently aligned with the domain rules you actually care about.

In a real org, “domain rules” look like:

- which repos count as “in scope” for a program,
- what you consider a production incident,
- your PR template requirements,
- how you want weekly reporting formatted,
- the tradeoffs your team prefers (when to refactor vs when to ship).

If those rules live only in a conversation, you are training the agent from scratch every time.

## What a skill is (and why the simplicity matters)

In the simplest formulation, a skill is an organized folder that packages procedural knowledge an agent can reuse.

That’s intentionally unglamorous.

Folders are easy to:

- create and review,
- version in Git,
- share across a team,
- and evolve over time.

A good skill can include:

- a `SKILL.md` that explains when to use it and the expected outputs,
- scripts that do the repetitive work,
- templates and examples,
- and references that keep the procedure grounded.

The key shift is that instead of asking the model to reinvent a workflow every time, you externalize the workflow as code and documentation. It becomes executable, inspectable, and changeable.

Here’s a concrete example. If your agent keeps generating release notes with the wrong structure, you can keep correcting it in chat, or you can ship a skill that includes:

- the release notes template your org uses,
- a script that pulls merged PR titles since the last tag,
- a checklist for what must be included (risk, customer impact, rollout plan),
- and a golden example that shows “this is what good looks like.”

Now the agent has something stable to follow.

## Progressive disclosure: protect the context window

If skills are going to scale, they need to stay out of the prompt until they’re needed.

That’s where progressive disclosure matters.

At runtime, the agent only needs to know a skill exists and what it’s for. It does not need every instruction and script injected into context all the time.

So you expose lightweight metadata up front, and the agent pulls the full `SKILL.md` only when it chooses to use the skill.

This is how you end up with a library of dozens or hundreds of procedures without turning every conversation into a bloated prompt.

## Why skills create leverage for teams

Skills aren’t just a packaging trick. They change how teams operationalize AI:

- **Repeatability:** the happy path becomes explicit and reusable.
- **Guardrails:** you can embed checks, defaults, and required outputs.
- **Faster onboarding:** new engineers inherit a working library on day one.
- **Institutional knowledge:** procedures become versioned artifacts, not tribal lore.
- **Continuous improvement:** when a workflow fails, you update the skill and everyone benefits.

This is also where the conversation changes with leadership. Instead of “we’re trying an AI agent,” you can say, “we shipped three skills that standardize how we do X, Y, and Z, and we can review and improve them like any other software asset.”

## How to start (without boiling the ocean)

Start with one workflow your team repeats weekly:

- writing release notes,
- preparing a metrics report,
- generating a PRD outline,
- incident communications,
- migrations with your internal conventions.

Create a skill folder with:

1) a short README that lists triggers and expected outputs,
2) one script that does the repetitive part,
3) a small golden example to sanity-check formatting.

Then use it for a week. The point is to create an improvement loop.

A good starting constraint is to pick a workflow where the “definition of done” is annoying but stable. That makes it obvious when the skill is working.

## Where this goes next

As skills mature, the obvious next step is to treat them like software:

- versioning and changelogs,
- review and ownership,
- testing and evaluation,
- dependency management.

Once you have that, you have a path to something agents struggle with on their own: consistent execution of expertise over time.

## Source

- Video transcript source material: https://www.youtube.com/watch?v=CEvIs9y1uog
