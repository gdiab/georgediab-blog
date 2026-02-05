---
title: "Weird Meteor error in Safari"
description: "Problems like this is why I prefer backend development. One browser crashing for what appears to be no good reason..."
pubDatetime: 2014-08-08T00:00:00-08:00
tags: ["meteorjs", "javascript", "debugging", "safari"]
draft: false
source: "https://georgediab.com/2014/08/08/weird-meteor-error-in-safari/"
---

Problems like this is why I prefer backend development. One browser crashing for what appears to be no good reason...

## The Problem

Our site had two routes (New and Popular) in the header. Rapidly switching between them before the progress bar completed would eventually trigger a Safari crash with the message: "a problem occurred with this webpage so it was reloaded."

Interestingly, the error never occurred when Safari's developer console was open—a classic debugging paradox.

## Initial Investigation

After three hours of cleanup work (starting at 2am), my co-founder and I resorted to systematically commenting out code sections to isolate the culprit. The problematic code used a Meteor template pattern:

```handlebars
{{#each itemsWithRank}}
  {{> itemItem }}
{{/each}}
```

## The Solution

Simply wrapping the included template in a div container resolved the crashes:

```handlebars
{{#each itemsWithRank}}
  <div>
    {{> itemItem }}
  </div>
{{/each}}
```

Still not sure why this is needed, only for Safari, but it works! Hopefully sharing this quirk helps others avoid similar debugging marathons.
