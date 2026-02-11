---
title: "MCP + Skills = connectivity + expertise"
description: "A pragmatic agent stack: runtime + MCP servers for access + skills for repeatable procedure. How to decide what to build where."
pubDatetime: 2026-02-06T20:56:03-08:00
draft: false
tags: ["ai", "agents", "mcp", "skills", "architecture"]
---

I keep hearing “build an agent,” and I get why: it’s a useful shorthand. But in practice it becomes a junk drawer — model, prompt, tools, glue code, and hope. That’s fine for a demo. It’s rough when you want something you can trust, debug, and hand off.

A better default is to build **skills**, and let the agent runtime be just that: a runtime. Skills are the unit of reliability. They’re small enough to review, specific enough to test, and reusable enough to justify the effort.

## Don’t build an agent. Build a skill.

If you’re an engineer learning this stack, here’s the framing that’s helped me the most:

- The **runtime** is the engine.
- **MCP** is the wiring to real systems.
- **Skills** are the repeatable, reviewable procedures you actually care about.

When you build “an agent,” the layers tend to tangle. Debugging turns into guesswork and every change risks ripple effects. A skills-first approach keeps the layers separate so you can see what broke, swap parts, and move faster with less thrash.

## The runtime is the engine

Start with the unglamorous bit: an agent that can read and write files, run scripts, and manage artifacts. It’s not exciting, but it’s the foundation that makes any of this practical.

Give an agent the ability to pull data from APIs, organize a workspace, run analysis code, and emit clean outputs, and you’ve unlocked a lot. It can handle real workflows without you building a custom “agent” for every domain.

Just don’t confuse capability with reliability. A runtime expands what’s possible, but it won’t tell you which steps to take or how consistent the outcome will be.

## MCP is the wiring

MCP (Model Context Protocol) is an open protocol for connecting LLM applications to external data sources and tools. I think of it as the adapter layer between your runtime and the real world. It gives you a standard shape for inputs, outputs, permissions, and logging so you can plug in a system without inventing a new integration every time.

If your agent needs to query Jira, fetch a doc, or kick off a deployment, MCP is the right place to invest. It keeps the access layer explicit and auditable.

You *can* skip MCP and wire external systems directly from skills, and plenty of teams do that early on. For a single runtime and a small set of workflows, that can be faster to ship. The trade-off shows up later. Integrations become more custom, harder to port between runtimes, and less consistent to audit. My default is pretty simple. If this is a prototype or one-off workflow, skills-only is fine. If you expect reuse across teams, tools, or agent frameworks, MCP pays for itself.

## Skills are the unit of reliability

This is where the leverage shows up.

A skill is a small, organized bundle of instructions, scripts, and resources that an agent can load to perform a specific task the same way every time. Anthropic’s [skill-creator example](https://github.com/anthropics/skills/tree/main/skills/skill-creator) is a good concrete reference. Each skill lives in its own folder with a `SKILL.md` file that defines how it should be used.

The runtime can see that a skill exists (and what it’s for), but it doesn’t need every instruction and script sitting in context all the time. When the agent decides it needs the procedure, it reads the `SKILL.md` and executes the scripts/resources in that folder. That progressive disclosure is how you end up with a library of reliable behaviors without bloating every prompt.

That packaging is the point. Skills capture “how we do this here” — the definitions, templates, guardrails, and scripts — in a way you can review, version, and reuse. That’s much closer to normal engineering than a giant prompt.

## Example: weekly engineering metrics (the boring kind you want)

Here’s how a skills-first approach plays out for a common workflow: a weekly engineering metrics report. The data lives in different systems. The judgment about what it means lives in your org. Keep those separate.

**MCP tools (connectivity):**

- `jira.search` → completed issues for the week
- `github.pull_requests` → merged PRs, cycle time, review latency
- `pagerduty.incidents` → incident counts and severities
- `confluence.getPage` (or Notion/Drive) → last report as reference

**A skill (procedure):**

The skill encodes what “weekly metrics” means for *your* org:

- normalization rules (teams renamed, services mapped, what counts as “production incident”)
- definitions (cycle time start/end, what qualifies as “blocked”)
- formatting (the exact report template your leaders expect)
- guardrails (must include: trend vs last week, top 3 drivers, short risk section)
- a script that composes the above into a single Markdown output

MCP gets you the inputs. The skill produces a consistent, reviewable result.

## Decide where it belongs (fast)

Here’s the quick test I use:

Build or [find](https://code.claude.com/docs/en/mcp) an **MCP server/tool** when:

- you need durable access to an external system,
- permissions and safety matter,
- multiple workflows will reuse the same API surface,
- you want stable interfaces, logging, and predictable behavior.

Build a **skill** when:

- you need consistent execution of a workflow,
- the knowledge is procedural and org-specific,
- you want versioned templates/scripts/checklists,
- you want progressive disclosure so it’s not always in context.

Most real workflows use both. Let MCP handle access, and let skills define the procedure.

## Treat skills like software

The moment a skill matters, manage it like production code. Give it an owner. Put it in version control. Review changes. Add simple tests or golden outputs. When a report or workflow depends on it, you want to know what changed before it surprises you.

That’s how you move from “agents are cool” to “agents are dependable.” When the layers are clear, the work stops feeling like magic and starts feeling like engineering.
