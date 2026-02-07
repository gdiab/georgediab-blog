---
title: "MCP + Skills = connectivity + expertise"
description: "A pragmatic agent stack: runtime + MCP servers for access + skills for repeatable procedure. How to decide what to build where."
pubDatetime: 2026-02-06T20:56:03-08:00
draft: true
tags: ["ai", "agents", "mcp", "skills", "architecture"]
---

## The agent stack is starting to clarify

A lot of “agent” discussions collapse into a single blob: model, tools, prompts, integrations, and vibes.

In practice, the systems that feel dependable have a clearer separation of concerns. A pragmatic architecture that’s emerging looks like:

1) a general agent runtime (code + filesystem + execution)
2) MCP servers for connectivity
3) a skills library for expertise and procedure

If you want agents to do real work reliably, you need all three.

## The base layer: a general runtime

Start with what’s increasingly universal: an agent that can read and write files, run scripts, and manage artifacts.

Once an agent can:

- pull data from APIs,
- organize files in a workspace,
- run Python for analysis,
- and generate outputs in standard formats,

it can tackle a huge range of tasks without you inventing a bespoke agent for each domain.

But universality alone doesn’t get you to predictable outcomes.

## MCP is the connectivity layer

MCP (Model Context Protocol) is best understood as the connectivity standard.

It answers “how does the agent reach systems and data?”

- How does it query Jira?
- How does it read from a database safely?
- How does it call a deployment tool?
- How does it access internal docs?

MCP servers are where you put stable interfaces: inputs, outputs, permissions, and observable behavior.

If you want the agent to access a system, MCP is usually the right abstraction.

## Skills are the expertise and procedure layer

Now the missing part: what does the agent do with that access?

This is where skills shine.

A skill is an organized folder that packages procedural knowledge the agent can reuse. It can contain:

- instructions and checklists,
- scripts and utilities,
- templates and examples,
- assets and “definition of done” guardrails.

The key distinction from MCP is that skills are not primarily about access. They’re about doing work the way you want, consistently.

If MCP gives the agent hands, skills teach craft.

## Why MCP and skills are complements (not competitors)

A useful division of labor:

- **MCP is “how to reach”**
  - stable APIs and data access
  - auth and permissions
  - side effects and safety
  - observability and constraints

- **Skills are “how to do”**
  - your team’s definition of “done”
  - sequencing multi-step workflows
  - formatting outputs
  - validation steps
  - repeatable scripts

In practice, many of the best skills orchestrate multiple MCP tools.

Example: “Prepare weekly engineering metrics”

- MCP tools: query Jira, fetch GitHub PR stats, pull incident data
- Skill: a scripted procedure that normalizes data, computes metrics, and outputs a report format your org already trusts

MCP connects you. Skills standardize you.

## Decision framework: should this be an MCP server or a skill?

Build an **MCP server/tool** when:

- you need durable access to an external system,
- permissions and safety matter,
- multiple workflows will reuse the same API surface,
- you want stable interfaces, logging, and predictable behavior.

Build a **skill** when:

- you need consistent execution of a workflow,
- the knowledge is procedural and org-specific,
- you want versioned templates/scripts/checklists,
- you want progressive disclosure so it’s not always in context.

Often you do both: MCP for access, skill for procedure.

## Treat skills like software

The moment skills matter, manage them like production assets:

- versioning
- code review
- ownership
- simple tests or golden outputs

That’s how you move from “agents are cool” to “agents are dependable.”

## Source

- Video transcript source material: https://www.youtube.com/watch?v=CEvIs9y1uog
