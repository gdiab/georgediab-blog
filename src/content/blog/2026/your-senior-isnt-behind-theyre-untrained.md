---
title: "Your senior isn't behind, they're untrained"
description: "On a flat curve the model stops being the differentiator and training takes over. How to upskill a mixed-skill team without a mandate that backfires."
pubDatetime: 2026-06-29T12:12:24-07:00
tags: ["ai", "engineering-management", "team-design", "productivity", "culture"]
draft: true
unlisted: false
agentSummary: "Steve Yegge's 'Flat Curve Society' argues that once frontier models get locked down, the gap between engineers stops being which model they have and becomes how well they use the one everyone has. The bottleneck is training, task decomposition, and knowing when not to spend a token. This post takes the management problem Yegge gestures at: who trains the people who aren't there yet. A Netflix study shows cohorts move up in about five hours of the right training (team-level opt-in, manager in the room, real work), but the diagnostic 'tokens per day' becomes poison the moment a manager turns it into a target. The skill being trained is judgment about what to delegate and how to slice it, not token volume. The skeptical senior is not behind; their skepticism is the asset, and they move when given a trusted guide and room, not a mandate."
agentPrompts:
  - "How do I run the Netflix-style cohort training (team-level opt-in, manager in the room, real work) on my own team?"
  - "Why is 'tokens per day' a useful diagnostic from above but a destructive target from below?"
  - "I have a skeptical senior engineer who won't adopt AI tools. How do I move them without a top-down mandate?"
  - "What's the actual skill being trained when teams get better at AI-assisted work, if it isn't burning more tokens?"
---

*Yegge's flat curve makes training the differentiator. Here's the part he leaves on the floor: who trains the people who aren't there yet, without lighting your team on fire.*

---

Steve Yegge has a new essay, *The Flat Curve Society*, and the metaphor is good enough that I want to steal the part he leaves on the floor.

His argument runs like this. The most capable models, the ones a notch above what you can access today, get locked down the way governments lock down weapons-grade nuclear material. There's a threshold of capability where a model becomes a national-security object, and past it the frontier disappears behind government walls. So the intelligence curve you can actually use goes flat, even as the real one keeps climbing in private. The tell is the spending: the data-center buildout only makes sense if the curve behind the wall is still exponential, even though from where you and I stand it looks like a plateau. From there Yegge splits the room. If you bet your career on the next model shipping, a plateau reads as a threat. If you were exhausted by the pace, it reads as relief. His move is to say both reactions miss it. The bottleneck was never the model. It's training, task decomposition, and knowing when to spend a token and when not to. On a flat curve, the difference between people stops being which model they have and starts being how well they use the one everyone has.

I think he's right. I also think he wrote it from the orchestrator's chair, as someone who already knows how to drive these tools and is describing the world from up there. The hard part is the one he gestures at but doesn't open up: who trains the people who aren't there yet, and how you do that without lighting your team on fire. That part I do have years on. The thing I've spent a career on is the management problem. Taking a team of people at wildly different levels of skill and willingness and moving them, together, onto something new without breaking trust. The tools are always changing, and this tension isn't new.

## The cohort trap

Steve mentions a Netflix study and digs into the details. I'll summarize it here. The study sorted beginners into three cohorts by how many tokens they burned on a heavy day: roughly zero (not really using agents), around 4M (one agent, watched all day), and 12–15M (two to four agents running without much supervision). People move up a cohort in about five hours of the right training, and they stay there. The training had a specific shape of one team at a time, five to ten people, including the manager, opting in on company time, bringing their own real work. Netflix noted that cutting any one of those corners would cause it to fall apart. Six weeks later, 96% were still in the higher cohort.

So the recipe works, until a manager reads "cohorts defined by tokens per day" and turns the diagnostic into a target. Tokens per day is a fine diagnostic from above and a terrible goal from below. The moment you tell a skeptical senior engineer that the objective is to burn more tokens, you have handed them a reason to dismiss the entire effort, and they are right to. Token count is a symptom of the skill, not the skill. Optimize the symptom directly and you get someone spinning up four agents to do work they could have done by hand in a tenth the time, generating a number that goes up while the judgment rots.

![Cartoon titled "Museum of Meaningless Metrics" showing museum exhibits for Lines of Code, Story Points, and Pull Requests, with a newest exhibit labeled "Tokens Spent" displaying a counter at 9,876,543,210. A docent gestures at it and says "Our newest exhibit."](/posts/your-senior-isnt-behind-theyre-untrained/metrics-cartoon.jpeg)

*"Museum of Meaningless Metrics," via Itamar Gilad.*

## Name the skill you are actually training

The thing that separates the top cohort from the bottom one is not volume. It is decomposition, and knowing when not to spend at all.

Yegge quotes Pierre Racz on this, and it is the best line in the essay. Racz founded Genetec, a security company, and he has the security veteran's instinct for not trusting a tool just because it's new: "it's not that I'm not using AI, I'm just extremely token-efficient." Yegge's own version is blunter: if you can trivially do a task by hand, do it by hand. The skilled operator is not the one running the most agents. It is the one who looks at a task and knows whether to hand it off, how to slice it so the handoff is clean, and which model is the dumbest one that can still do the job. That last instinct is the whole game.

The DORA data points the same way. AI amplifies whatever discipline you already have. Decomposition is that discipline, and it's the skill that holds its value even when the models stop leaping ahead, when you can't count on next quarter's release to change the game for you.

So when you train the cohort, you are not training people to consume more compute. You are training judgment about what to delegate and how to cut it. The token count rises as a side effect. Aim at the side effect and you miss.

## Why the unplanned mandate backfires

Most companies won't introduce this as careful cohort training. They'll introduce it as a mandate: a top-down "we're an AI-first shop now," usually with a number attached and no plan for the people who aren't ready yet. That unplanned version is the one that backfires. Push change without first addressing literacy "in a quantitative but also deeply empathetic way," and you fuel anxiety, resentment, and pushback. Your folks will resist, and you will lose trust while falling further behind on your organizational goals.

Skepticism is a feature. I trust the engineer who asks why before adopting a tool more than the one who adopts everything, because the skeptic is the one who notices when the tool or the workflow is wrong.

I have one in mind. I wrote about them a while back, in a [piece about the identity crisis AI created for engineers](https://www.georgediab.com/posts/2026/ai-identity-crisis): a senior I respect who was grieving the part of the craft AI was eroding. They're still in that bottom cohort, but moving, slowly, to the next cohort. They use the tools for planning and for reviewing, but they aren't convinced the tools write the best code, and when they hand one a real task they usually end up re-steering it back on course. Some of that is the model. A lot of it is that they're working in a legacy-ish codebase the agent doesn't have the context to navigate, and they haven't yet hit the point of frustration where they sit down and write the codebase's opinions into a CLAUDE.md so the agent stops guessing. The mandate framing would read all of this as resistance to be overcome. It isn't. It's a skilled person making an accurate call about where the tool currently fails them. Even though they're still in that bottom bracket, they're slowly guiding themselves (with a bit of help from me) to that next level.

What actually moved them wasn't pressure. It was people. They started trying new models and tools after following voices they already trusted: peers and teachers who'd shaped their growth years ago and have since moved into AI. Matt Pocock is the clearest example: the TypeScript teacher they'd learned from is now teaching AI practices for engineers, much of it [free on his YouTube channel](https://www.youtube.com/@mattpocockuk). That's the lesson I'd hand any manager staring at a holdout: you don't argue a skeptic into the higher cohort, you give them a guide they already respect, a framework to follow, and the room and time to travel the path of levelling up.

Training is empowerment with constraints, which is the only kind of empowerment that works. "Empower your team" on its own produces chaos. The Netflix recipe lands because the constraints are doing the work: team-level opt-in so nobody is exposed alone, the manager in the room so it is not "you go learn this while I keep doing the real job," real work on the table so the skill has somewhere to bite. The constraints are what make the autonomy safe to hand over.

## What breaks it

The engineer I mentioned above is still struggling to get out of that bottom cohort because they have deliverables and leadership hasn't yet believed this training is necessary.

They're opting in because they're seeing where the puck is headed.

But it breaks on individual opt-in, because the lone volunteer has no cover and the holdouts have no reason to move. It breaks when the manager stays out of the room, because that is the clearest possible signal that this is beneath them. It breaks on synthetic exercises, because nobody transfers a toy skill to real stakes. And it most often breaks when the organization does not own the path to the outcome.

## The plateau is the opening

You don't have to buy the lockdown story to take the bet. When a government directive pulled Anthropic's most capable model worldwide over a security prompt, which I wrote about in ["Fix this code"](https://www.georgediab.com/posts/2026/fix-this-code), a lot of us started wondering whether Yegge's flat curve hypothesis would prove true. Maybe it is. It's one data point and a prediction, and a single new model can still break or change your workflow next quarter. But the training argument doesn't depend on the curve going flat. The judgment underneath (what to delegate, how to slice it, when not to spend at all) is what survives a model that moves and a model that doesn't. If Yegge's right, the flat curve makes the lesson more urgent. If he's wrong, you've still trained the only thing that compounds either way.

The manager who treats literacy as a training problem, with real time and real constraints, ends up with a team that compounds. The manager who sets a tokens-per-day target gets a number that goes up and a team that has quietly checked out. The curve looking flat does not decide which one you get. You do.
