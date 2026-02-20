---
title: "From spicy autocomplete to the software factory: what's real, what's hype, and what teams should do next"
description: "A grounded look at the 'software factory' framing for agentic coding: where it helps, where it misleads, and practical steps for engineering leaders."
pubDatetime: 2026-02-18T18:48:00-08:00
tags: ["ai", "agents", "software-engineering", "engineering-management", "architecture"]
draft: false
---

## THE RABBIT HOLE

- Dan Shapiro's "five levels" is a useful shared language for where teams are in AI-assisted development, and where the next bottlenecks are. Source: <https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/>
- StrongDM's "software factory" shows a real path to high autonomy, but it mostly proves a different point: **verification systems beat clever prompts**. Source: <https://simonwillison.net/2026/Feb/7/software-factory/>

## Why this rabbit hole matters

If you build software for a living, you're likely already feeling a shift. It's more likely than ever that we're headed toward a "software factory", where specs go in and working software comes out.

StrongDM's software factor includes two rules that are intentionally provocative:

- "Code must not be written by humans."
- "Code must not be even reviewed by humans."

If your first reaction is "no thank you", that's healthy. But dismissing it entirely is also a mistake, because there's a real signal buried under the rhetoric.

**The limiting factor is no longer code generation. It's evidence.**

If your team can create fast, reliable evidence that a change is correct, agents become a force multiplier. If you can't, agents mostly produce plausible-looking risk.

## The framing: levels of AI assistance

Dan Shapiro proposes five levels of "driving automation", mapped onto software development. It's explicitly inspired by the [NHTSA levels of driving automation](https://www.nhtsa.gov/sites/nhtsa.gov/files/2022-05/Level-of-Automation-052522-tag.pdf) and outlined in [Dan's post](https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/).

In Dan's version (my paraphrase, but aligned with his descriptions):

- **Level 0:** Mostly manual. You might use AI like a search engine or for occasional suggestions.
- **Level 1:** Discrete tasks delegated to an "AI intern" (tests, docstrings, small refactors).
- **Level 2:** Pairing flow, where AI is a constant collaborator. Many engineers I speak to are here.
- **Level 3:** "Safety driver" era: you manage multiple agent threads and spend your life in diffs.
- **Level 4:** Robotaxi: you write specs, you monitor, you come back later and see if it worked. This is where I feel like I am at.
- **Level 5:** Dark factory: an end-to-end black box turning specs into software.

I like this framing because it does two things most AI discourse fails to do:

1) It gives you language to describe the step change between "faster typing" and "different job".
2) It speaks to the pain that I hear from teams at Level 3. Pr review has become the bottleneck and eats up the time saved using AI to implement and execute work.

That said, the levels can be dangerously motivating if you read them as a ladder every team should climb.


## The pushback: what gets lost in the factory metaphor

Simon Willison's write-up of StrongDM's work is both impressed and skeptical, in the right ways.

A few critiques I'd highlight (paraphrasing Simon's broader argument, not quoting him verbatim):

- "No human reviews code" is only sane if you replace review with something even stronger.
- If both implementation and tests are produced by the same agents, you need independent checks to avoid "assert true" style self-justification.
- The interesting question is not "can agents write code?" but "how do we prove it works?"

Simon points to scenario-based validation, holdout scenarios, and a Digital Twin Universe (DTU) as the real story. Source: <https://simonwillison.net/2026/Feb/7/software-factory/>



## What I think is actually happening

Here's the model that best matches what I see in practice:

- We are not building a factory that outputs "software" in bulk.
- We are building **automation pipelines that propose diffs**, and **verification pipelines that accept or reject them**.

In other words:

- The agent writes.
- The harness judges.
- The human designs the harness and decides what "good" means.

StrongDM's public "Software Factories and the Agentic Moment" page leans heavily into this idea: specs + scenarios drive agents that converge without human review. Source: <https://factory.strongdm.ai>

That's not really "no humans". It's humans shifting where their effort is placed.

- from writing code
- to writing constraints
- to designing evaluation
- to operating the system

## The real bottleneck: verification, not generation

"Code must not be reviewed by humans" is only defensible if you have something better than human review. StrongDM's answer (as described by Simon) centers on scenario testing and a holdout-style evaluation set:

- Scenarios are end-to-end user stories.
- Scenarios can be stored outside the codebase so agents cannot overfit or "teach to the test."
- They introduce "satisfaction" as a probabilistic measure: what fraction of scenario trajectories look like they satisfy the user.

Source: <https://simonwillison.net/2026/Feb/7/software-factory/>

This is the crucial leadership takeaway:

**If you want autonomy, you have to pay for evidence.**

You pay for it with:

- test harnesses
- good documentation and specs
- sandboxes
- simulation environments
- observability
- and careful boundaries



## Where I agree with the "software factory" vision

I think the "factory" framing is directionally right in a few places:

1) **Specs matter more.** Clear specs become a high-leverage artifact.
2) **The job changes.** More time moves into planning, validation, and system design.
3) **Small teams get disproportionate leverage.** If you can automate validation, headcount scales differently.



## Where I disagree



- **Show the software.** It's hard to evaluate a 'dark factory' claim without seeing the end product quality, not just the process. StrongDM invested heavily in publishing a grandiose playbook, but there's no real source code or battle-tested patterns to point at. When you strip away the narrative, you're left wondering: is this a production engineering practice, or is it a fundraising and recruitment story?

- **They're betting on the future, not the present.** StrongDM (and Anthropic, for that matter) are betting that models 6 to 12 months from now will be significantly more capable of navigating and fixing spaghetti code. That might be true. But publishing a Level 4 playbook based on where models will be is a different claim than proving it works today.
- **Specs are not formal methods.** Markdown specs do often improve code outputs from agents, but they are not a proof.
- **Maintenance debt is still real.** If you do not read code, you are betting that you never need to debug performance pathologies or subtle concurrency issues. That is a big bet in any serious system.




If you want "no human review" and you do not have a serious investment in validation, you are not brave.

You are gambling.


A reframe that I think will make more sense to engineering teams:

- Agents are can be trusted more with spec-driven agentic development if... Your CI, tests, documentation, and observability are in place as guardrails and you have a good rollback plan when that fails you.

The goal is not to eliminate engineers.

The goal is to make engineers spend time where they're uniquely valuable:

- defining outcomes
- designing boundaries
- deciding what to trust

