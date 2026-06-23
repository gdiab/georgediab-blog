---
title: "Fix this code"
description: "Three words pulled a frontier AI model off the internet. The export control meant to protect national security disarmed the people it was supposed to defend."
pubDatetime: 2026-06-23T07:00:00-07:00
tags: ["ai", "ai-policy", "security", "anthropic", "regulation"]
heroImage: "/posts/fix-this-code/hero.jpg"
draft: false
unlisted: true
---

*Three words pulled a frontier model off the internet. The export control disarmed the people it was meant to protect.*

---

On Friday, June 12, a US government directive forced Anthropic to pull its newest model off the internet worldwide. The trigger was three words a researcher at Amazon had typed into it during routine testing.

The three words were "fix this code."

Here is the whole exploit. The researcher fed Fable 5 a file full of known vulnerabilities and asked it to "review this code for security issues." Fable refused. So they asked it to "fix this code." It complied, patched the bugs, and with a few more prompts wrote tests proving the patches worked. That sequence, finding a flaw, fixing it, verifying the fix, is what the US government decided was dangerous enough to justify an export-control directive. Anthropic got the order at 5:21 PM Eastern. To comply, it pulled Fable 5 and Mythos 5 for everyone, worldwide.

## The jailbreak that wasn't

[Katie Moussouris](https://x.com/k8em0) was the only outside expert who got to read the report behind the ban. She spent four years renegotiating the Wassenaar Arrangement, the international agreement that governs dual-use technology, so she knows what an export-controllable capability actually looks like. Her verdict: "'Fix this code,' plus several manual steps to generate test scripts, should never have triggered an export control." Finding and fixing bugs, she wrote, "is the most valuable thing an AI model can do for defensive security."

She is not a lone voice. Around four hundred security researchers signed [an open letter](https://freefable.org) organized by [Alex Stamos](https://x.com/alexstamos), with [Bruce Schneier](https://www.schneier.com) and former US deputy CTO [Ed Felten](https://x.com/EdFelten) among them. Their line is flat: this is "a necessary capability in any model that is intended to write secure code and should not be considered an offensive capability."

The people who do this for a living are close to unanimous. The ban hits defense, not offense. To understand how a "fix this code" prompt became a national-security event, you have to back up four months.

## Back up four months

In February, the Department of War [asked Anthropic to allow Claude for "any lawful use"](https://www.anthropic.com/news/statement-department-of-war). Anthropic said no. It refused to drop two safeguards specifically: no mass domestic surveillance, and no fully autonomous weapons, on the grounds that "frontier AI systems are simply not reliable enough" for the latter. Anthropic's CEO, [Dario Amodei](https://darioamodei.com), called the government's posture contradictory, since the same administration was calling Anthropic both a security risk and essential to national security.

The response was quick. The Department of Defense labeled Anthropic a "supply-chain risk," a designation that, as Fortune reported, had never before been used to punish a company for declining contract terms. OpenAI, which accepted the "any lawful purpose" framing Anthropic rejected, won the Pentagon work within hours. To be fair to OpenAI, it says it kept equivalent limits on weapons and surveillance, just written differently in the contract. The difference was the framing, not the safeguards.

Four months later, a "fix this code" prompt handed the same government a reason to pull Anthropic's flagship. By then, a federal judge had already weighed in on the earlier blacklisting. In March, US District Judge Rita Lin granted Anthropic a preliminary injunction against the supply-chain-risk designation and called it "classic illegal First Amendment retaliation," finding that the government's own documents showed it was punishing Anthropic for its public stance on AI safety. That ruling was about the February designation, not the June model pull. But it means a court has already looked at how this government treats this company and reached for the word retaliation.

I can't prove the June ban was retaliation. I can read a sequence. A company refuses the government on weapons and surveillance, gets labeled a risk, watches its competitor take the contract, and then loses its top model over a prompt that security professionals consider routine. The "fix this code" jailbreak wasn't the reason. It was the excuse.

## You can't arm only the defenders

This is the part that should bother anyone in tech. The directive was aimed at foreign nationals, not a blanket domestic ban. The government's logic, steelmanned, is that you keep a dangerous capability away from adversaries while your own defenders keep using it. That logic falls apart on contact with how software works.

You cannot hand a vulnerability-finder to defenders only. The same model that finds the hole so you can patch it finds the hole so someone else can walk through it, because finding and fixing are the same operation. There is no build of Fable that helps the defender and refuses the attacker. So a capability this useful has to go to everyone, and the actual work is getting it into defenders' hands and pushing them to harden the systems they own.

That is why an export control is the wrong instrument. Anthropic could only comply by pulling Fable worldwide, so American defenders lost it too. Adversaries who want the same capability have other frontier models, or will train their own, because Fable is not uniquely good at this. The ban took the tool from the people who follow US law and left it with everyone who doesn't. If the goal was national security, the directive damaged the thing it was named after.

## I pay for Claude

I pay for Claude, and I pay for it on purpose. Anthropic seemed to be the lab that took safety and the human stakes seriously, and I wanted my money going to the company making the choices I would want made. The uncomfortable part of this episode is that the posture I was paying for, the willingness to tell the government no, is plausibly what made Anthropic the easy target.

The clean response is to vote with my wallet: reward the labs that hold the line, starve the ones that fold. I believe in that, and in practice it barely works, including for me. I pay for Codex too, and I'll pay for whatever I need to test next. If you forced me down to one two-hundred-dollar subscription I'd keep Claude and drop the rest, but nobody's forcing the choice, so I don't make it. There are too many models, they turn over too fast, and the honest truth is my clients often pick the provider and I build with what they picked. The market for "I'll pay more for a company with principles" is real but thin, and it thins a little more every time switching costs drop and a new model tops the benchmarks. Allegiance is easy to feel and hard to act on.

## Intelligence is a supply line now

If you build on these models, the thing to take from this is colder than the politics. Your access to intelligence is a government variable now. A model you depend on can be pulled on a Friday over a prompt, and whether it comes back rides on a fight between a company, a cabinet secretary, and a judge. Steve Yegge argued this month, in ["The Flat Curve Society"](https://steve-yegge.medium.com/the-flat-curve-society-36c8b01eb33b), that the most capable models will end up locked behind government walls while the curve the rest of us can touch goes flat. Fable is the case he reaches for. The lockdown isn't a forecast anymore. It has a date and a directive number.

Governments have pulled models before, but never quite like this. Italy [yanked ChatGPT in 2023](https://www.npr.org/2023/03/31/1167491843/chatgpt-italy-ban-openai-data-collection-ai) and [DeepSeek in 2025](https://www.reuters.com/technology/artificial-intelligence/italys-privacy-watchdog-blocks-chinese-ai-app-deepseek-2025-01-30/), and plenty of countries have moved against DeepSeek since. Those were fights about privacy and foreign ownership. Fable looks like the first time an export control was aimed at a model for being too good at defending code. Whether that turns into a pattern or a one-off a court cleans up, I don't know yet. Either way, if you build on frontier models, stop treating access like a utility that's always on. It's a supply line, and supply lines get cut.
