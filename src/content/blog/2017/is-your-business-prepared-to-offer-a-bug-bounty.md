---
title: "Is Your Business Prepared to Offer a Bug Bounty?"
description: "There are a number of ways that small businesses can prepare for cyber attacks. Setting up a bug bounty budget is one of the ways to do this."
pubDatetime: 2017-07-28T14:30:38-04:00
tags: ["security", "bug-bounty", "startup"]
draft: true
source: "https://tech.co/business-cybersecurity-bug-bounty-2017-07"
heroImage: "/posts/is-your-business-prepared-to-offer-a-bug-bounty/hero.jpg"
---

It's July in Las Vegas, and the cybersecurity community has once again gathered to attend BlackHat USA. As previously reported, there are a number of ways that small businesses can prepare for cyber attacks. Setting up a bug bounty budget is one of the ways to do this.

Kymberlee Price, Open Source Security Management Lead at Microsoft, hosted a BlackHat conference panel that proposed: "Fad or Future? Getting Past the Bug Bounty Hype." She was joined by Charles Valentine of Indeed, Lori Rangel of Silent Circle, and Angelo Prado of SalesForce.

The panel shared their experiences with setting up and maintaining a bug bounty program. The challenge is not only to plan for the resources needed to pay the bounty, but also to staff the internal team needed to create the patch. Across the panel, it was estimated that $450 was the average bounty paid, while Prado, the Director of Product Security at Salesforce, shared that the company had once paid $13,370 to one very smart hacker.

As for staffing the patch team, Valentine mentioned specifically that he wished his department had staffed up better prior to setting up a bug bounty program in 2014. The process of validation in addition to creating fixes is intensive.

If you're ready to start a bug bounty program, here are the takeaways from this talk which should be considered best practices.

## Consider the Community

Spending time performing outreach and focusing on the community of your hackers/security researchers is a critical first step. Learn what motivates your researchers. Spending time on community outreach and communication raises your program's reputation as well, and there's a benefit there. The security of your products is at stake here.

These researchers are simply individuals who are trying to earn a living helping companies identify issues with security. Treating them as a part of your team can often go a long way in creating a vibrant community of motivated folks. You may need to spend more time on communication, however, because you may also find that your community of security researches are not native English speakers. Your patch team might include a community liaison that fills a sort of customer support role here. This can ensure that the bug submissions are well documented and clear, allowing your team to validate the issue quickly.

A poorly written bug submission might seem, at first, like a low value bug, but with more communication, you might learn how seriousness of the issue. This just becomes a teachable moment, asking for screen captures or perhaps a rewrite to clarify a submission so that it's value can be better ascertained.

![Bug bounty panel at BlackHat USA](/posts/is-your-business-prepared-to-offer-a-bug-bounty/panel-photo.jpg)
*Panel Photo from @Kym_Possible*

## Monitor the Success & Popularity of Your Program

There are many companies running a bug bounty program, so attracting the best security researchers might be a priority of yours. If you feel the quality of your submissions goes down, it might be time to either raise the award amounts for the bounties, or examine the program as a whole. Valentine, VP of Technology Services at Indeed, added:

"It's a marketplace. You got a bounty amount, the payment amounts need to be rational for the work that's happening. If we make a change, we pay. It's established a reputation for our program. Be clear about what you will pay and why."

Obviously, the rewards can keep the best talent working on "white hat" hacking on your products, but if your budget is small, you'll need to be creative. Rangel, Director of Product Management at Silent Circle, suggests other ways to reward the community. Lean toward more fun and social prizes: when the payouts are low, offer more kudos. Sometimes the reputation you can spotlight for folks is just as valuable to a security researcher as cold hard cash. A balance of reputation and monetary compensation can often keep the community going, especially when you are just starting the process up.

![Cybersecurity](/posts/is-your-business-prepared-to-offer-a-bug-bounty/hexadite-cyber-security.jpg)

## Set Clear Expectations for Your Bug Bounty Program

You'll need to monitor how quickly you can process the bugs that are posted and the required budget as your program evolves. Either way, set clear expectations early on. You don't want to disenfranchise a researcher who took the time to find and submit a bug, only to find out that you don't pay for a bug that has been posted already, or is considered out of scope for the program. Even if a bug is out of scope, you may need to decide internally if you want to consider a bug, and consider expanding your scope.

Taking care of your community of researchers is a good idea, since it's likely your bug bounty program will become a great recruitment tool as you grow your product and security team!

When you start your own program, you will quickly need to decide when to pay. If you pay on identification, you risk the word getting out that a bug exists before you have had time to fix it. If you do decide to approach awards this way, be very clear with your disclosure policy, meaning that a researcher can't share the information or write a blog post about the find. Often, researchers expand their reputation and reach by writing about their finds and techniques. Often, you can approach these folks on a case-by-case basis once you have fixes in place.

## Other Considerations: Public or Private?

Another thing to consider when starting and expanding your bug bounty program is whether you want to make it a public or private program. When it's private, you select folks to enter the program. The panelists sometimes use private programs when they are planning on releasing new software. Perhaps in a beta or even alpha stage. This sometimes makes more sense when you are expanding your software.

If you already have a public program, and are planning some large or new releases, you can "fork" your public program and create a private program for this new scope. Then you can choose great folks from your public program to get first dibs on the private program.

Branding it as a VIP program often provides some excitement for the folks you select, reigniting engagement and upping the quality and value of submissions in these private programs. Remember the private isn't confidential; people will chat about your new private program, so be specific in the disclosures for even the private programs.

I'd like to add that even in my own experience as a startup founder, I've certainly paid out bug bounties. I've been responsible for many products and small startups, but I haven't ever had the resources to employ a patch team. I hadn't set aside a budget, either. Even still, when bounty hunters discovered vulnerabilities, I appreciated the heads-up and I found the funds to pay them once I verified the bug. It's possible for any size business to implement.
