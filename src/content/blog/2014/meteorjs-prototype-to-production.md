---
title: "MeteorJs: Prototype to Production App In A Few Weeks"
description: "MeteorJs is an open-source platform for building top-quality web apps in a fraction of the time, whether you're an expert developer or just getting started."
pubDatetime: 2014-09-17T09:00:38-04:00
tags: ["meteorjs", "javascript", "engineering", "startup"]
draft: false
source: "https://tech.co/meteorjs-production-app-2014-09"
heroImage: "/posts/meteorjs-prototype-to-production/hero.jpg"
---

MeteorJs is an open-source framework to quickly build web apps that is powerful enough for an experienced developer, but easy enough for a beginner to get started on building a production app.

Meteor Development went through Y Combinator in 2011 and also raised $11.2 million from Alexis Ohanian and Andreessen Horowitz, among others.

When my co-founder and I got accepted into an idea accelerator to quickly iterate on a a product concept we had, we knew we wanted to get an MVP live for user feedback and validating this concept. We chose to use Meteor for our MVP because it’s the perfect tool to prototype quickly.

If you are a developer building an MVP, every line of code could be a waste when you haven’t yet proven whether the idea even has legs. When that is the case, you need to build fast to conserve your time investment until you can get some validation on your idea.

Meteor uses javascript on the server-side and the client-side, because at its core, it’s based on Node.js. Staying in the context of javascript on both the server and client side makes things a lot easier. Context switching, no matter how good you are in the “backend” and “front end” languages has a cost, and again, you are trying to make the best use of your time when building an MVP.

Meteor has a magical bonus of a reactive UI, meaning that if the collection of the data changes, Meteor handles the re-rendering of the client side. Real-time capabilities in other frameworks can involve a bunch of extra work and engineering, but with Meteor, it’s already baked in.

If you are still on the fence about using Meteor, I suggest you check out these spots on the web to learn more:

[The Meteor Github repository](https://github.com/meteor/meteor) – Meteor is an open-source framework, so you are free to fork the source and create your own customized version of meteor, or jump in to help fix bugs. Check out the [issues list](https://github.com/meteor/meteor/issues) to see what problems are currently out there to decide if anything there might be a show stopper for your project.

[The Meteor Hackpad](https://meteor.hackpad.com/) – Meteor has a public hackpad that they use to plan new features and share early information. Of course, the official Meteor docs can be found on Meteor.com [here](http://docs.meteor.com/).

If you are sold, and are ready to get your hands dirty, here are some resources to get started and learn tips and tricks:

[Try one of the examples](http://www.meteor.com/examples) – It’s easy to get started with one of the 4 sample Meteor projects.  Three steps and you can dive in. Here are the steps for the leaderboards example:

1. Install Meteor (if you haven’t already). In your [Terminal window](http://macapper.com/2007/03/08/the-terminal-an-introduction/), run:

   ```
   $ curl https://install.meteor.com | sh
   ```

2. Make a copy of the example.

   ```
   $ meteor create --example leaderboard
   ```

3. Get it running on the cloud.

   ```
   $ cd leaderboard
   $ meteor deploy <name of your app>.meteor.com
   ```

[Meteor Hacks](https://meteorhacks.com/) – Dive deeper into Meteor with [Arunoda Susiripala](https://twitter.com/arunoda)‘s blog. You will find more knowledge about all the moving parts in the Meteor framework, as well as be kept up to date on news and releases. Arundoa also has built [Kadira](https://kadira.io/), which is a tool that will help you track and troubleshoot performance issues with your app.

Meteor is still in beta but at version 0.9.1.1 an official release is right around the corner. Even in beta, it’s a powerful framework that can power your production apps.

We used Meteor to go from PhotoShop mockups to production app in 4 weeks! If you do end up trying Meteor, let me know in the comments!
