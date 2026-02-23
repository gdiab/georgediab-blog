---
title: "The dark factory is not the point"
description: "A pragmatic guide for engineers and leaders: scale AI coding autonomy by investing in verification, quality gates, and evidence pipelines."
pubDatetime: 2026-02-23T09:10:20-08:00
tags: ["ai", "agents", "software-engineering", "engineering-management", "architecture"]
heroImage: "/posts/the-dark-factory/hero.jpg"
draft: false
---

Most teams do not need a "dark factory." They need a better way to prove that AI-generated changes are safe to ship.

That is the core argument of this piece:

- Code generation is improving fast.
- Verification is still the bottleneck.
- The winning teams will invest in evidence systems, not just better prompting.

If this "dark factory" conversation is new to you, start with these two posts first:

- Dan Shapiro on the five levels from spicy autocomplete to software factory: [danshapiro.com](https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/)
- Simon Willison's analysis of StrongDM's approach and where verification becomes the real story: [simonwillison.net](https://simonwillison.net/2026/Feb/7/software-factory/)

The recent "software factory" discussions making their way across the many AI and engineering blogs is useful because it makes this bottleneck visible. Dan Shapiro gives a clear maturity model for AI-assisted development, from "spicy autocomplete" to full autonomy. Simon Willison's analysis of StrongDM's work highlights the harder question behind the hype: not "can agents write code?" but "how do we know the output is correct?"

## Use levels as diagnostics, not destiny

Shapiro's levels are helpful when treated as a diagnostic tool. They give teams language for the shift from "AI helps me type faster" to "my job is now orchestration, validation, and judgment."

They are less helpful when treated as a maturity ladder every team must climb. Different products, risk profiles, and compliance requirements should lead to different stopping points.

For engineering leaders, the practical use of the model is this:

1. Identify your current operating mode honestly.
2. Identify the current bottleneck (usually review and validation latency).
3. Invest in the bottleneck before pushing for more autonomy.

## What the factory metaphor gets right

The factory metaphor is directionally right in three ways.

1. Specs matter more than before. Ambiguous intent gets amplified by agents.
2. The role of engineers shifts toward system design, evaluation design, and risk management.
3. Small teams can gain disproportionate leverage when verification is strong.

StrongDM's published framing also reinforces a useful idea: autonomous code generation is only credible when connected to strong scenario-based validation.  
Source: [StrongDM Factory](https://factory.strongdm.ai)

## Where the metaphor breaks

The metaphor becomes risky when it implies that humans are no longer needed in software delivery.

In practice, "no human review" is only defensible if review is replaced with something stronger than traditional PR review for the risk you are taking. As described by Simon Willison, StrongDM emphasizes scenario testing, holdout-style checks, and probabilistic "satisfaction" rather than only line-by-line human inspection.  
Source: [Simon Willison](https://simonwillison.net/2026/Feb/7/software-factory/)

That is not a no-human system. It is a human-repositioned system:

- less effort in hand-writing implementation
- more effort in defining constraints
- more effort in evaluation harnesses
- more effort in operating rollback and incident paths

## The operating model that scales

For most engineering organizations, the scalable model is:

1. **Generation pipeline**: agents propose diffs from tasks/specs.
2. **Verification pipeline**: independent checks accept or reject diffs.
3. **Governance pipeline**: humans set policy, thresholds, and escalation rules.

This model is more robust than "agent writes code, reviewer glances at PR" because it makes quality gates explicit and repeatable.

If you want autonomy, you have to pay for evidence.

Evidence usually means:

- scenario and regression harnesses
- specs and documentation quality
- observability with release-level attribution
- sandboxes and safe rollback mechanisms
- boundaries for where full autonomy is allowed

## What to do in the next 90 days

For engineers:

1. Turn recurring production bug patterns into automated end-to-end test scenarios.
2. Build at least one holdout-style eval set agents cannot see while generating.
3. Measure first-pass acceptance and post-release rollback rates, split by change source (human vs agent-assisted).

For engineering leaders:

1. Define autonomy tiers by system criticality.
2. Require explicit quality gates before increasing autonomy in any tier.
3. Measure review latency, escaped defects, and rollback rate as first-class metrics.

## Where human review should remain mandatory

Even with strong automation, keep mandatory human review for:

- security-sensitive changes
- data integrity or migration logic
- complex concurrency behavior
- compliance and policy-critical workflows
- incident-response and rollback playbooks

Autonomy is not a binary switch. It is a scoped capability that should expand only when evidence quality improves.

## Bottom line

The goal is not to eliminate engineers. The goal is to move engineers to the highest-leverage work: defining outcomes, designing boundaries, and deciding what to trust.

Call it a factory if you want. Operationally, it is an evidence engine.
