---
title: "Twilio Announces Console to Improve Developer Experience"
description: "Twilio Console is a new developer experience that launched during the company's annual SIGNAL conference event in San Francisco."
pubDatetime: 2016-05-24T16:08:08-04:00
tags: ["twilio", "developer-tools", "api"]
draft: true
source: "https://tech.co/signal-conference-twilio-console-2016-05"
heroImage: "/posts/twilio-console-developer-experience/hero.jpg"
---

It’s never been a better time to be a [DOer](https://www.twilio.com/doers).

Jeff Lawson, CEO of the cloud communications platform API [**Twilio**](http://tech.co/tag/twilio), kicked off at the company’s annual [**SIGNAL Conference**](https://www.twilio.com/signal) in San Francisco with a keynote address emphasizing how important software developers are to the core of the Twilio mission (to “fuel the future of communications”) and to improving the world overall.

> “You can literally change the world with a text editor,” Lawson noted. “The future of communications is software. And it’s getting built every day by the software developers of the world.”

To continue to fuel the developer’s fire, the team at Twilio has been hard at work on launching a new end-to-end experience for prototyping, building, and debugging Twilio apps. [**Twilio** **Console**](https://www.twilio.com/blog/2016/04/introducing-the-new-twilio-console.html) was officially announced and launched today at SIGNAL.

## Twilio Console Was Built By the Team and the User Community

According to Rob Spectre, developer evangelist at Twilio, teams from all departments within the company have been working to release the new Console for the last full year. Fifty different contributors on five global teams came together to re-imagine the developer experience, from front to back.

Over the last 52 weeks, Twilio developer evangelists have sat side-by-side with a million developers, across 400 different user events, to learn about the most important aspects of a developer’s journey.

## The Importance of a Committed User Base

As Lawson pointed out in his keynote, [software developers](http://tech.co/tag/software-developer) are writing the code that builds the future. So, it’s important to a company like Twilio to have developers that will rally around your product. Just five years ago, an API and decent documentation was all you needed to get the developer community excited and committed to your platform and services.

Now, [with new challenges](http://tech.co/struggles-keeping-software-demand-2016-04) and even less time to get it all done, [developers need more](http://tech.co/worst-kinds-software-developers-2015-06) to succeed. Tools to streamline development, troubleshoot problems, and documentation that quickly points you to a solution to a problem are now the gold standard.

According to the company’s press release and blog post, Twilio’s new Console is a Documentation and Debugger that makes creating and shipping Twilio code faster than ever before.

## Finding and Tracking Bugs Is Faster and Offers More Context

> “It can be difficult to look for errors in all the webhooks, so the Debugger will show the exact URL and endpoint that generated the issue,” Spectre explains.

According to the release, the Debugger will watch for new errors no matter what Twilio product you’re using to build. If it notices that an error has taken place, it will glow red. Clicking on the icon will give you the option to go to the Debugger or mute these notifications.

In addition to grouping these debugging events by type, developers can now group errors by the webhook URI that is associated with it, giving you unprecedented insight to the problematic endpoints of your Twilio application.

You can then click on any of those endpoints to see all of the errors associated with just that endpoint:

![Twilio Debugger showing errors grouped by endpoint](/posts/twilio-console-developer-experience/debugger.png)

Robust search fills out Debugger’s ability to pinpoint errors. In addition to searching by webhook URI, developers can search for errors by phone number, Call Sid, SMS Sid, or any of the parameters that Twilio included in its HTTP request to your application. Full-text search inside the debugger means that you can do specific customer support for all the folks in a geographical area around an issue, or add any other contextual data related to the error.

Debugger is powerful enough that [developers can save time tracking down issues](http://tech.co/32-awful-things-software-engineer-2016-04), and just get to the necessary step: fixing them. No need to wait for that support ticket or call to add context to the error. The glowing bug icon was one of the biggest crowd-pleasers during its demo for the SIGNAL audience. Directly from the Console, you are alerted to existing bugs and with one click, you’re delivered to the Debugger, which sorts errors by “Last Seen”.

## TwiML Bins Acquired and Bundled Into Release

One of the aspects of today’s release, [TwiML Bins](https://www.twilio.com/blog/2016/05/introducing-native-twiml-bins-powered-by-the-twilio-cloud.html), was actually a product that came out of the successful Twilio user community. “We teamed up with them to create a native, in-console experience, and this is one of the most compelling parts of this launch,” Spectre excitedly shared.

On May 3rd, 2016, Twilio acquired [twimlbin.com](http://twimlbin.com) which brought with it the the best new feature to the console: TwiML Bins. Now you can create static TwiML responses for your webhooks right inside the console without the need to stand up your own publicly available web host.

As a developer, having to quickly stand up a server and throw up a few test endpoints to prototype a feature can be a drag on time. This literally takes a ton of work off your plate in the early stages of planning and development.

I tried it last night, and it is so easy and painless to set up a phone number and get a response returned.

***Go ahead! Try it! Call (702) 800-7236 right now!***

![Creating a TwiML Bin in the Twilio Console](/posts/twilio-console-developer-experience/twiml-bins.png)

## Documentation That Isn’t an Afterthought

Accompanying the new Console is a redesigned Documentation experience. Twilio has also been hard at work re-imagining Twilio Docs from the ground up to help you find the information you are looking for faster than ever before.

Similar to the new Console, Docs enjoys a new developer responsive design permitting the documentation you’re reading and the code you’re writing to fit side-by-side with your text editor.

Browsing for the right languages and products is also faster with a new filterable sidebar, to display documentation to fit your technology stack. Later, when you search for help with a specific feature, like how to send a picture in an SMS, you will get code snippets in the language and platform you selected previously.

![Light and dark documentation themes](/posts/twilio-console-developer-experience/light-dark-theme.png)

Because there is no greater hell than having to follow PHP examples when you write everything in JavaScript. Oh…and it’s not an afterthought; every developer has a preference, you can select the layout theme of your documentation. Choose Light or Dark! (I chose Dark!)

All this and the ability to pin the services you use most to the left side of the Console, new Getting Started wizards, and a few developer-centric Easter eggs hidden in the code snippets, and you have a developer experience that reduces obstacles and helps us get back to work.
