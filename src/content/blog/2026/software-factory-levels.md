---
title: "From spicy autocomplete to the software factory: what’s real, what’s hype, and what teams should do next"
description: "A grounded look at the ‘software factory’ framing for agentic coding: where it helps, where it misleads, and practical steps for engineering leaders."
pubDatetime: 2026-02-18T18:48:00-08:00
tags: ["ai", "agents", "software-engineering", "engineering-management", "architecture"]
draft: true
---

## TL;DR

- TODO: 3–5 bullets once draft is complete.

## Why this rabbit hole matters

If you build software for a living, you’re already feeling the shift:
- Autocomplete is table stakes
- “Agents” are the new pitch
- And the bold claim is that we’re headed toward a **software factory**

This post is my attempt to separate:
- What is *directionally true*
- What is *marketing metaphors*
- What is *operationally actionable* for a real engineering team

## The framing: levels of AI assistance

Dan Shapiro proposes a progression from “spicy autocomplete” up to a “software factory” level. Roughly:

1) Level 1: autocomplete
2) Level 2: chat + copilots
3) Level 3: agentic workflows
4) Level 4: “robotaxi” software development (self-driving for a scoped domain)
5) Level 5: full factory (end-to-end software output as a system)

TODO: confirm level naming and exact definitions with citations from Dan’s post.

## The pushback: what gets lost in the factory metaphor

Simon Willison’s critique (paraphrased) is that “software factory” language:

- Overstates autonomy, understates supervision
- Compresses the hard part (requirements, evaluation, integration)
- Suggests linear scaling when reality is iteration and feedback loops

TODO: add exact points + quotes with citations.

## What I think is actually happening

Here’s the model that best matches what I see in practice:

- We are not building a factory that outputs “software” in bulk.
- We are building **a stack of automation + review + eval harnesses** that makes small changes cheaper.
- The teams that win won’t be the ones who “let the agent code.”
- They’ll be the ones who build **fast, reliable feedback** so agents can be useful without becoming dangerous.

## The real bottleneck: verification, not generation

TODO:
- How codegen shifts the constraint from writing to reviewing
- Why tests and observability become the product
- Why “agentic coding” is mostly “agentic diff proposals” until evals get strong

## Practical guidance (what to do next week)

### 1) Pick a narrow, boring domain

Treat “Level 4” like self-driving:
- It works in constrained environments.
- It fails catastrophically outside them.

### 2) Invest in evals and tight loops

Concrete checklist:
- Golden tests for critical flows
- Snapshot tests for UI where appropriate
- Deterministic build + lint + typecheck gates
- Minimal reproduction harnesses

### 3) Change how you staff and review

- Review becomes the scarce resource.
- The best engineers become “systems of critique,” not just builders.

### 4) Measure the right things

Suggested metrics:
- Lead time for small changes
- Review latency
- Defect escape rate
- “Rollback frequency” / incident rate
- Test suite signal-to-noise (flake rate)

## Where I agree with the ‘software factory’ vision

TODO: list 3–5 points that are directionally correct.

## Where I disagree

TODO: list 3–5 points where the metaphor misleads or incentivizes bad behavior.

## A useful reframe: software as a managed system, not a factory

TODO: propose a better metaphor: autopilot for diffs, or CI as the assembly line, etc.

## Sources

- Dan Shapiro: https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/
- Simon Willison: https://simonwillison.net/2026/Feb/7/software-factory/
- YouTube (starting point): https://www.youtube.com/watch?v=bDcgHzCBgmQ

