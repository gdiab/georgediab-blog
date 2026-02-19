---
title: "From spicy autocomplete to the software factory: what’s real, what’s hype, and what teams should do next"
description: "A grounded look at the ‘software factory’ framing for agentic coding: where it helps, where it misleads, and practical steps for engineering leaders."
pubDatetime: 2026-02-18T18:48:00-08:00
tags: ["ai", "agents", "software-engineering", "engineering-management", "architecture"]
draft: true
---

## TL;DR

- Dan Shapiro’s “five levels” is a useful shared language for where teams are in AI-assisted development, and where the next bottlenecks are. Source: <https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/>
- StrongDM’s “software factory” shows a real path to high autonomy, but it mostly proves a different point: **verification systems beat clever prompts**. Source: <https://simonwillison.net/2026/Feb/7/software-factory/>
- Treat “Level 4” like self-driving: it works in constrained domains with strong guardrails, and it fails in the open world.
- If you want agents to ship production software safely, the work shifts to: scenarios, evals, holdouts, sandboxes, digital twins, and operational feedback loops.

## Why this rabbit hole matters

If you build software for a living, you’re already feeling the shift:

- Autocomplete is table stakes.
- Agents are the new pitch.
- The bold claim is we’re headed toward a “software factory”, where specs go in and working software comes out.

This rabbit hole started for me with a video describing StrongDM’s software factory, including two rules that are intentionally provocative:

- “Code must not be written by humans.”
- “Code must not be even reviewed by humans.”

Those lines are from the transcript of the video that kicked this off. (YouTube: <https://www.youtube.com/watch?v=bDcgHzCBgmQ>)

If your first reaction is “nope”, that’s healthy.

But dismissing it entirely is also a mistake, because there’s a real signal buried under the provocation:

**The limiting factor is no longer code generation. It’s evidence.**

If your team can create fast, reliable evidence that a change is correct, agents become a force multiplier. If you can’t, agents mostly produce plausible-looking risk.

## The framing: levels of AI assistance

Dan Shapiro proposes five levels of “driving automation”, mapped onto software development. It’s explicitly inspired by the NHTSA levels of driving automation. Sources:

- Dan’s post: <https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/>
- NHTSA “Levels of Automation” PDF: <https://www.nhtsa.gov/sites/nhtsa.gov/files/2022-05/Level-of-Automation-052522-tag.pdf>

In Dan’s version (my paraphrase, but aligned with his descriptions):

- **Level 0:** Mostly manual. You might use AI like a search engine or for occasional suggestions.
- **Level 1:** Discrete tasks delegated to an “AI intern” (tests, docstrings, small refactors).
- **Level 2:** Pairing flow, where AI is a constant collaborator.
- **Level 3:** “Safety driver” era: you manage multiple agent threads and spend your life in diffs.
- **Level 4:** Robotaxi: you write specs, you monitor, you come back later and see if it worked.
- **Level 5:** Dark factory: an end-to-end black box turning specs into software.

I like this framing because it does two things most AI discourse fails to do:

1) It gives you language to describe the step change between “faster typing” and “different job”.
2) It predicts the next pain: Level 3 is a review and coordination bottleneck.

That said, the levels can be dangerously motivating if you read them as a ladder every team should climb.

Not every team needs a robotaxi.

## The pushback: what gets lost in the factory metaphor

Simon Willison’s write-up of StrongDM’s work is both impressed and skeptical, in the right ways.

A few critiques I’d highlight (paraphrasing Simon’s broader argument, not quoting him verbatim):

- “No human reviews code” is only sane if you replace review with something even stronger.
- If both implementation and tests are produced by the same agents, you need independent checks to avoid “assert true” style self-justification.
- The interesting question is not “can agents write code?” but “how do we prove it works?”

Simon points to scenario-based validation, holdout scenarios, and a Digital Twin Universe (DTU) as the real story. Source: <https://simonwillison.net/2026/Feb/7/software-factory/>

If Dan’s post is a map, Simon’s post is the warning label:

**If you skip the verification part, you don’t reach Level 4. You just ship faster failure.**

## What I think is actually happening

Here’s the model that best matches what I see in practice:

- We are not building a factory that outputs “software” in bulk.
- We are building **automation pipelines that propose diffs**, and **verification pipelines that accept or reject them**.

In other words:

- The agent writes.
- The harness judges.
- The human designs the harness and decides what “good” means.

StrongDM’s public “Software Factories and the Agentic Moment” page leans heavily into this idea: specs + scenarios drive agents that converge without human review. Source: <https://factory.strongdm.ai>

That’s not “no humans”.

That’s humans moving up a level:

- from writing code
- to writing constraints
- to designing evaluation
- to operating the system

## The real bottleneck: verification, not generation

“Code must not be reviewed by humans” is only defensible if you have something better than human review.

StrongDM’s answer (as described by Simon) centers on scenario testing and a holdout-style evaluation set:

- Scenarios are end-to-end user stories.
- Scenarios can be stored outside the codebase so agents cannot overfit or “teach to the test.”
- They introduce “satisfaction” as a probabilistic measure: what fraction of scenario trajectories look like they satisfy the user.

Source: <https://simonwillison.net/2026/Feb/7/software-factory/>

This is the crucial leadership takeaway:

**If you want autonomy, you have to pay for evidence.**

You pay for it with:

- test harnesses
- scenario suites
- sandboxes
- simulation environments
- observability
- and careful boundaries

## Practical guidance (what to do next week)

This is the part that matters if you’re leading a real team.

### 1) Pick a narrow, boring domain

Treat “Level 4” like self-driving:

- It works in constrained environments.
- It fails catastrophically outside them.

Pick a domain with:

- crisp APIs
- high-quality testability
- low ambiguity
- low blast radius

Good candidates:

- internal tooling
- CRUD admin flows
- data migrations with strong invariants
- small, well-scoped services

### 2) Build a scenario suite that is not in the repo

Start with 10 scenarios that reflect real user outcomes.

Store them outside the repo (even a private doc works) and treat them like your “truth set.”

If you want to go deeper, StrongDM’s DTU idea is basically this taken to the extreme: build safe clones of third-party dependencies so you can run high-volume scenarios without production constraints. Source: <https://factory.strongdm.ai/techniques>

### 3) Separate generation from validation

If you let the same agent write the code and decide if the code is correct, you are setting yourself up for convincing lies.

Practical version:

- Use one agent to propose.
- Use a different agent (or different prompt, different model, different context) to critique.
- Use deterministic checks where possible: typecheck, lint, unit tests.
- Use scenario checks for end-to-end behavior.

### 4) Upgrade your definition of “done”

When you add agents, the output increases.

So “done” can’t mean “the code compiles.”

It has to mean:

- It passes deterministic gates.
- It passes scenario gates.
- It has an observable footprint.
- It has a rollback story.

### 5) Change staffing assumptions

If you want to move up the automation levels, you need at least one person who:

- loves test design
- cares about operational correctness
- can turn vague requirements into crisp constraints

That person is often not your fastest feature coder.

They’re your systems thinker.

### 6) Metrics that actually matter

If you are “AI-native”, you should expect these to move:

- **Lead time for small changes** (should drop)
- **Review latency** (should drop if validation improves, or spike if you just produce more diffs)
- **Defect escape rate** (should not rise)
- **Rollback frequency / incident rate** (should not rise)
- **Flake rate** (must go down, or agents will thrash)
- **Scenario satisfaction** (if you adopt scenario validation)

If your lead time drops but defects rise, you didn’t build a factory.

You built a faster bug generator.

## Where I agree with the “software factory” vision

I think the “factory” framing is directionally right in a few places:

1) **Specs matter more.** Clear specs become a high-leverage artifact.
2) **The job changes.** More time moves into planning, validation, and system design.
3) **Small teams get disproportionate leverage.** If you can automate validation, headcount scales differently.

StrongDM releasing an “agent” as markdown specs is a fun example of the mindset: Attractor has no code, just specs. Source: <https://github.com/strongdm/attractor>

## Where I disagree

Where I think the metaphor misleads:

1) It implies linear scaling. In practice, complexity still bites, and coordination still exists.
2) It suggests code review is optional. It’s only optional if something stronger replaces it.
3) It hides cost tradeoffs. Even Simon calls out the “$1,000/day per engineer” claim as a major constraint. Source: <https://simonwillison.net/2026/Feb/7/software-factory/>

If you want “no human review” and you do not have a serious investment in validation, you are not brave.

You are gambling.

## A useful reframe: autopilot for diffs, not a factory for software

A reframe that lands better for most teams:

- Agents are autopilot for *small changes*.
- Your CI, tests, scenarios, and observability are the road.
- Your constraints are the lane markers.
- Your rollback plan is the brake.

The goal is not to eliminate humans.

The goal is to make humans spend time where they’re uniquely valuable:

- defining outcomes
- designing boundaries
- deciding what to trust

## Sources

Core sources:

- Dan Shapiro: <https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/>
- Simon Willison: <https://simonwillison.net/2026/Feb/7/software-factory/>
- StrongDM: <https://factory.strongdm.ai>
- StrongDM techniques: <https://factory.strongdm.ai/techniques>
- NHTSA levels of automation PDF: <https://www.nhtsa.gov/sites/nhtsa.gov/files/2022-05/Level-of-Automation-052522-tag.pdf>
- YouTube (rabbit hole start): <https://www.youtube.com/watch?v=bDcgHzCBgmQ>

Evidence links (supporting reading):

- StrongDM Attractor (spec-only release): <https://github.com/strongdm/attractor>
- StrongDM cxdb (AI context store): <https://github.com/strongdm/cxdb>
- Scenario testing (background): <https://en.wikipedia.org/wiki/Scenario_testing>
- Simon on proving code works: <https://simonwillison.net/2025/Dec/18/code-proven-to-work/>
- StrongDM “Techniques” index (DTU, gene transfusion, semports, pyramid summaries): <https://factory.strongdm.ai/techniques>
- Cursor YOLO mode discussion (historical marker referenced by Simon): <https://forum.cursor.com/t/yolo-mode-is-amazing/36262>
- Simon on “inflection point” (referenced in the post): <https://simonwillison.net/2026/Jan/4/inflection/>
- Simon’s link to “inhuman mistakes” (referenced in the post): <https://simonwillison.net/2025/Mar/2/kellan-elliott-mccrea/>
- Organized Ergonomics note on Fanuc dark factory (Dan’s analogy): <https://www.organizedergi.com/News/5493/robots-the-maker-of-robots-in-fanuc-s-dark-factory>

