---
title: "When AI Finds More Vulnerabilities Than Your Team Can Fix"
description: "If AI raises vulnerability discovery throughput, the real constraint becomes remediation capacity: triage, ownership, patching, testing, and release speed."
pubDatetime: 2026-04-14T16:06:00-07:00
tags: ["ai", "security", "software-engineering", "engineering-management"]
draft: true
---

Most security conversations still assume finding the vulnerability is the hard part.

That assumption is getting shakier.

Anthropic’s [Project Glasswing](https://www.anthropic.com/glasswing) is interesting for the obvious reason: it suggests frontier models may be getting better at finding serious vulnerabilities. But the more useful way to read the announcement is not as a product story. It is an operating-model warning.

If vulnerability discovery throughput goes up materially, the bottleneck does not disappear. It moves.

And where it moves matters a lot more than the demo.

The real question is simple: **can your organization absorb the queue that follows?**

## Discovery is only the start of the work

A discovered vulnerability is not a fixed vulnerability.

Between those two states sits a lot of organizational work:

- reproduction
- validation
- severity assessment
- ownership assignment
- disclosure coordination
- patch development
- regression testing
- release planning
- rollout
- exception handling when the fix is risky or incomplete

That is why Glasswing matters. It does not prove security has been automated. It raises the possibility that discovery may start arriving faster than many organizations can process responsibly.

Microsoft’s Security Response Center made a similar point in its recent post on how it is evolving with AI. AI can help discover more issues across a broader surface area, but response still depends on validation, prioritization, coordination, and remediation workflows that can operate at higher speed without losing judgment. Source: [Microsoft MSRC](https://www.microsoft.com/en-us/msrc/blog/2026/04/strengthening-secure-software-global-scale-how-msrc-is-evolving-with-ai)

That is a different claim from “AI is doing security now.” It is closer to: “AI may be raising the rate at which security work enters the system.”

## Security throughput is an organizational problem

This is where I think the conversation gets more useful.

Most companies do not fail because they found too few issues. They fail because fixes compete with roadmap work, ownership is fragmented, release processes are slow, and high-risk changes are operationally expensive.

In other words, the hard part is often not knowing that a problem exists. The hard part is getting the right people to agree on the priority, make the change safely, test it under realistic conditions, and ship it without creating a second problem.

This is fundamentally an organizational throughput story.

If findings increase, the queue spills across multiple functions:

- AppSec
- service owners
- platform teams
- SRE and incident response
- release engineering
- communications and compliance, when the issue is serious enough

So the practical question becomes: **who absorbs the queue when AI finds more than the organization can remediate this sprint?**

## The queue already exists

One reason I do not want to write this as vendor hype is that the underlying bottleneck is not new.

Veracode’s [State of Software Security 2024 report](https://www.veracode.com/state-software-security-2024-report/) says more than 70% of organizations have security debt, nearly half have critical security debt, and only 35% of applications show a sustained ability to eliminate all critical security debt.

Sit with that.

The industry already has a remediation capacity problem. Better discovery does not magically fix that. In some organizations, it will make the constraint impossible to ignore.

NIST’s guidance on enterprise patch management describes patching as an organizational system, not a one-step technical action. Teams have to identify, prioritize, acquire, test, deploy, verify, and sometimes stage or defer patches based on operational constraints. Source: [NIST SP 800-40 Rev. 4](https://csrc.nist.gov/pubs/sp/800/40/r4/final)

That matters because it keeps us honest. Finding a flaw is one input into a much larger machine.

And on the maintainer side, Daniel Stenberg’s post about curl security workflow changes is one of the clearest real-world signals that higher report volume and lower report quality can create their own operational burden. His focus is not “wow, more findings.” It is workflow, abuse resistance, triage quality, and how maintainers cope when the intake system gets noisier or heavier. Source: [Daniel Stenberg](https://daniel.haxx.se/blog/2026/02/25/curl-security-moves-again/)

That is the part many AI security stories skip. More input does not necessarily mean more safety. Sometimes it just means more backlog.

## Good security posture starts to look like delivery posture

If Glasswing is directionally right, one implication is uncomfortable: security posture increasingly depends on software delivery posture.

The teams that handle AI-scale discovery best will probably not be the teams with the flashiest scanner. They will be the teams with:

- clear service ownership
- reproducible validation environments
- low-friction patch pipelines
- release trains that can move urgent fixes quickly
- sensible severity and escalation rules
- the discipline to distinguish critical work from queue inflation

That is partly why the CISA [Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) is useful context here. The catalog turns technical flaws into a prioritization system with deadlines, ownership implications, and real remediation pressure.

That is what the future queue looks like. Not an abstract graph of findings, but a stream of issues somebody has to burn down under time pressure.

## The new failure mode is remediation debt

If coding teams hit review debt when AI sped up implementation, security teams may be heading toward a version of remediation debt.

That looks like:

- known issues sitting longer in backlog
- more exceptions and temporary mitigations
- more time spent classifying and suppressing findings
- more tension between product velocity and security response
- more accepted risk that quietly becomes normal

This is also where skepticism matters.

The right skeptical response to Glasswing is not “this is fake” or “AI will never find real bugs.”

The more credible skeptical response is:

**Even if these capabilities are real, defensive outcomes are still constrained by remediation systems, not scanner horsepower.**

That is a more useful frame for leaders because it focuses attention on what they can actually improve this quarter.

## What leaders should do now

If you lead engineering, security, or platform work, I think the right response is practical.

Measure the downstream system, not just the discovery surface.

That means tracking things like:

- time to reproduce
- time to validate
- time to assign ownership
- time to patch
- time to deploy
- backlog growth under increased finding volume
- percentage of critical issues fixed within the expected window

And it means tightening the operating model around those metrics:

- build better validation environments
- clarify the handoffs between AppSec and engineering
- reduce release friction for high-severity fixes
- predefine escalation paths before the queue spikes
- run a tabletop exercise around doubled finding volume

If a frontier model suddenly made your incoming queue materially larger next month, would your organization get safer or just louder?

That is the question worth running a tabletop against.

## The constraint has moved

Glasswing matters, but probably not for the reason the launch headline suggests.

The real signal is not that AI may find more vulnerabilities. It is that many organizations may discover their true bottleneck is remediation capacity.

The winners will not be the teams with the best demo.

They will be the teams that can absorb the queue, turn findings into fixes, and ship those fixes before the backlog becomes its own security risk.

## Sources

- Anthropic, [Project Glasswing](https://www.anthropic.com/glasswing)
- Microsoft MSRC, [How MSRC is evolving with AI](https://www.microsoft.com/en-us/msrc/blog/2026/04/strengthening-secure-software-global-scale-how-msrc-is-evolving-with-ai)
- Daniel Stenberg, [curl security moves again](https://daniel.haxx.se/blog/2026/02/25/curl-security-moves-again/)
- NIST, [SP 800-40 Rev. 4: Guide to Enterprise Patch Management Planning](https://csrc.nist.gov/pubs/sp/800/40/r4/final)
- CISA, [Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- Veracode, [State of Software Security 2024](https://www.veracode.com/state-software-security-2024-report/)
