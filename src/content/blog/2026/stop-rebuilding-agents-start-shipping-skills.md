---
title: "Stop rebuilding agents. Start shipping skills."
description: "Agents are getting smarter, but reliability comes from packaging expertise as versioned, testable procedures. Skills are the missing layer."
pubDatetime: 2026-02-06T20:55:07-08:00
draft: true
tags: ["ai", "agents", "skills", "developer-productivity", "engineering-management"]
---

## The problem: smart agents, unreliable outcomes

Most of us have had the same experience with AI agents: they can be brilliant in bursts, and then deeply frustrating when you need them to do something the same way twice.

That frustration is not primarily a model intelligence problem. It is a reliability and expertise problem.

An agent can write code, reason about tradeoffs, and stitch together a workflow. But when the work requires domain rules, organizational conventions, or “how we do it here” context, the agent often behaves like a talented intern seeing your system for the first time. You can coach it. You can paste in checklists. It might do a great job once. Then it drifts.

That drift is what kills adoption.

Teams will tolerate an occasional mistake from a human if the process is learnable and stable. They will not tolerate a tool that changes its mind every week about what “good” looks like.

So the question becomes: how do we turn one-off brilliance into consistent execution?

A pragmatic answer is: stop rebuilding agents and start shipping skills.

## A mental model shift: the runtime is becoming universal

A lot of agent work is converging on a surprisingly universal base:

- a loop that manages context,
- a runtime that can read and write files,
- and the ability to execute code (bash, Python, etc.).

Once an agent can pull data from APIs, organize artifacts in a filesystem, run analysis, and generate outputs in standard formats, you don’t need a bespoke “agent” per domain. Code becomes the universal interface to the digital world.

That’s good news because it means you can reuse the same scaffolding across lots of problems.

It also makes a different limitation obvious.

If your runtime is general, the thing that differentiates outcomes is not “can the agent do work.” It is “does the agent know how we do this work.”

## Intelligence isn’t expertise

If you’re doing taxes, you don’t want a superhuman mathematician re-deriving the tax code from first principles. You want a tax professional who applies the rules consistently.

That’s the gap with many agents today. They are capable, but not consistently aligned with the domain rules you actually care about.

In a real org, “domain rules” look like:

- which repos count as “in scope” for a program,
- what you consider a production incident,
- your PR template requirements,
- how you want weekly reporting formatted,
- the tradeoffs your team prefers (when to refactor vs when to ship).

If those rules live only in a conversation, you are training the agent from scratch every time.

Even when you get a good result, it is brittle. It depends on the current chat history, the particular phrasing you used, and whether the agent remembered to ask the “right” questions.

That is not how engineering teams scale.

## What a skill is (and why the simplicity matters)

In the simplest formulation, a skill is an organized folder that packages procedural knowledge an agent can reuse.

That’s intentionally unglamorous.

Folders are easy to create, review, version in Git, and share across a team. They are also the most practical place to store the “stuff that makes this reliable”:

- a `SKILL.md` that explains when to use it and what outputs are expected,
- scripts that do the repetitive parts,
- templates and examples,
- references that keep the procedure grounded.

The key shift is that instead of asking the model to reinvent a workflow every time, you externalize the workflow as code and documentation. It becomes executable, inspectable, and changeable.

Here’s a concrete example.

Imagine your agent keeps generating release notes with the wrong structure. You can keep correcting it in chat, or you can ship a skill that includes:

- the release notes template your org uses,
- a script that pulls merged PR titles since the last tag,
- a checklist for what must be included (risk, customer impact, rollout plan),
- and a golden example that shows what good looks like.

Now the agent has something stable to follow.

This is the part that matters for engineering managers.

If the procedure lives in a skill, you can review it like you review code. You can improve it over time. You can hand it to a new team member. You can see what changed when the outputs change.

## Progressive disclosure: protect the context window

If skills are going to scale, they need to stay out of the prompt until they’re needed.

That’s where progressive disclosure matters.

At runtime, the agent only needs to know a skill exists and what it’s for. It does not need every instruction and script injected into context all the time.

So you expose lightweight metadata up front, and the agent pulls the full `SKILL.md` only when it chooses to use the skill.

This is how you end up with a library of dozens (eventually hundreds) of procedures without turning every conversation into a bloated prompt.

It also nudges you toward a healthier mental model.

Instead of “the agent knows everything,” you get “the agent can load the right procedure at the right time.” That’s a model engineers are comfortable with.

## Why skills create leverage for teams

Skills aren’t just a packaging trick. They change how teams operationalize AI:

**Repeatability**

The happy path becomes explicit and reusable. You stop paying the tax of re-explaining the same thing.

**Guardrails**

You can embed checks, defaults, and required outputs. If a report must contain a trend line and a short risk section, you can encode that. You can even fail the run if those sections are missing.

**Faster onboarding**

New engineers inherit a working library on day one. They do not have to learn everything through tribal knowledge or the manager’s memory.

**Institutional knowledge**

Procedures become versioned artifacts, not vibes. If a stakeholder wants to know why the weekly report changed, you can point to a diff.

**Continuous improvement**

When a workflow fails, you update the skill and everyone benefits.

This is also where the conversation changes with leadership.

Instead of “we’re trying an AI agent,” you can say, “we shipped three skills that standardize how we do X, Y, and Z, and we can review and improve them like any other software asset.”

## How to start (without boiling the ocean)

Start with one workflow your team repeats weekly:

- writing release notes,
- preparing a metrics report,
- generating a PRD outline,
- incident communications,
- migrations with your internal conventions.

Pick something with two properties:

1) The definition of done is annoying but stable.
2) The cost of inconsistency is real (time wasted, confusion, rework).

Then create a skill folder with:

- a short README that lists triggers and expected outputs,
- one script that does the repetitive part,
- a golden example that makes “good” unambiguous.

Use it for a week. Expect it to be imperfect. The point is to create an improvement loop.

## A practical example: weekly engineering metrics

A good “skills-first” candidate is weekly engineering metrics, because it looks simple on the surface and gets complicated fast.

Everyone asks for “PR throughput” and “cycle time.” The data is scattered. The definitions vary by team. The format expectations are political.

We are building exactly this as an example.

The connectivity layer can come from an MCP server (GitHub now, Jira next). The procedure lives in the skill:

- which repos count,
- what time window to use (past 7 days from Sunday night, or run ad hoc),
- what metrics to compute,
- and what the report must include.

Then you can ship it as a tool a team lead can run locally, generate a Markdown report plus JSON, and share the artifacts.

That is the core thesis of skills in practice: connectivity plus procedure, packaged as something reviewable.

## Where this goes next

As skills mature, the obvious next step is to treat them like software:

- versioning and changelogs,
- review and ownership,
- testing and evaluation,
- dependency management.

Once you have that, you have a path to something agents struggle with on their own: consistent execution of expertise over time.

## Source

- Video transcript source material: https://www.youtube.com/watch?v=CEvIs9y1uog
