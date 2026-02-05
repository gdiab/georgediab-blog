---
title: "MVC and WCF"
description: "Guidance on calling WCF services from MVC applications isn't clearly documented online. Here's the recommended approach."
pubDatetime: 2011-06-11T00:00:00-08:00
tags: ["mvc", "wcf", "aspnet"]
draft: false
source: "https://georgediab.com/2011/06/11/mvc-and-wcf/"
---

It's not clear on the interwebs, or maybe my google searching skills are diminished... but if you want to make calls to a WCF service from an MVC application, the way it seems best to do it is to ignore the 'M' and make calls to your service from within the controller.

This pragmatic solution prioritizes functionality over strict adherence to the Model-View-Controller pattern's separation of concerns.
