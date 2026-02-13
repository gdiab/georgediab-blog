---
title: "AI is a new abstraction layer, not the end of software engineering"
description: "Grady Booch’s ‘third golden age’ framing is a needed antidote to AI doom. Code generation changes the mechanics of building software, but the engineering job (balancing forces, shipping safely, and owning outcomes) stays." 
pubDatetime: 2026-02-10T22:00:44-08:00
draft: true
tags: ["ai", "agents", "software-engineering", "engineering-management", "architecture"]
---

Software engineering is having an existential moment.

The claim goes something like: “AI can write code now, so what happens to software engineers?”

After listening to **Grady Booch** on *The Pragmatic Engineer* podcast, I think there’s a far more useful way to frame what’s happening:

**We’re not watching the end of software engineering. We’re watching a shift in abstraction.**

If you’ve been in the industry long enough, you’ve seen this pattern before. The tools change, the mechanics change, the floor rises. The job remains.

Source video: <https://www.youtube.com/watch?v=OfMAtaocvJw>

## A quick summary of Booch’s argument

Booch’s core point is simple and easy to miss in all the AI noise:

**Software engineering is not “typing code.”**

It’s engineering. It’s the work of balancing forces:

- technical constraints (latency, complexity, correctness)
- economic constraints (time, budget, opportunity cost)
- human constraints (teams, coordination, incentives)
- security and safety constraints (supply chain, abuse, reliability)
- legal and ethical constraints (privacy, harm, governance)

Code is one of the levers we use. It’s not the job.

That distinction matters because most “AI will replace engineers” takes are really about one slice of the work: producing code artifacts.

## The anti-doom lens: this has happened before

There’s a calm reassurance in Booch’s framing: developers have lived through “career-ending” abstraction shifts before.

- compilers changed what it meant to be good at assembly
- higher-level languages moved work from instruction sets to intent
- libraries and platforms moved work from reimplementation to integration

AI-assisted development fits this same arc.

If you’re feeling dread, that’s not irrational. It’s the normal human response when the skill you’ve invested in is getting commoditized.

But if history is any guide, the winners are rarely the people who cling to the old layer. The winners are the ones who:

- learn the new layer fast
- keep their fundamentals sharp
- move their attention up the stack

## A useful distinction: “software that endures” vs “software you throw away"

One nuance I appreciated in the episode is the split between:

- **throwaway software**: small scripts, one-off automations, personal workflows
- **enduring software**: systems that run in production, serve customers, and outlive the original authors

AI makes throwaway software cheaper and more accessible. That’s a net win for the world.

But enduring software is where the engineering still lives. Enduring systems need:

- explicit tradeoffs
- careful interfaces
- observability
- deployment safety
- incident response
- ownership

If anything, AI makes the *engineering* side harder, because it can multiply change volume.

## The real bottleneck isn’t code. It’s review and verification.

Here’s the part I don’t think we talk about enough:

**If AI increases the amount of code we can produce, the constraint shifts.**

The new constraint is not “how fast can we type.” It’s:

- how fast can we verify correctness
- how fast can we detect security issues
- how fast can we understand blast radius
- how fast can we recover when we’re wrong

In other words: the bottleneck becomes code review, testing, and operational maturity.

That’s also why the best teams I know are investing in boring stuff right now:

- stronger tests and faster CI
- smaller diffs and clearer PR standards
- static analysis and policy checks
- guardrails for tool access and production changes

AI makes those investments pay off more, not less.

## What the YouTube comments reveal (and why it matters)

I pulled the sentiment from the comments on the episode, and the shape is pretty telling.

Most reactions are positive. People describe it as a “breath of fresh air” compared to the usual AI doom cycle.

There are also two recurring counterpoints:

1) **Career anxiety is real**
   - Even people who liked the episode still worry that many jobs will compress.

2) **Verification becomes the limiter**
   - Several comments point to QA, review, and security as the part that needs to evolve when code volume spikes.

There’s also a small but loud “UML baggage” thread (some people can’t resist dunking on OO/UML). That’s a reminder: the most persuasive version of this argument is grounded in today’s reality, not résumé bullet points.

## My take: what should engineers and leaders do this year?

If you want a practical “anti-doom” action plan, here’s mine.

### For individual engineers

- **Strengthen fundamentals**: systems thinking, debugging, distributed systems, security basics, testing discipline.
- **Learn the new tools**: but treat them like power tools. Get faster, and stay accountable.
- **Get good at review**: the ability to evaluate changes quickly and safely is becoming more valuable.

### For engineering leaders

- **Redesign the workflow for higher change volume**
  - smaller diffs
  - clearer review checklists
  - better automated verification
- **Treat eval and guardrails as first-class**
  - measure failure modes, not just “did it work once”
  - define what tools can touch, and when
- **Invest in “boring reliability”**
  - it’s what turns AI speed into compounding delivery, instead of compounding incidents

## Close

AI is going to change how we build software. That part is real.

But the framing that everything collapses into “prompting” is shallow.

Engineering is the job of owning outcomes in the real world, under constraints, with humans in the loop.

That job is not going anywhere.

If anything, we’re entering a phase where it matters more.

---

**Sources**
- The Pragmatic Engineer: “The third golden age of software engineering – thanks to AI, with Grady Booch” (YouTube): <https://www.youtube.com/watch?v=OfMAtaocvJw>
