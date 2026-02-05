---
title: "MVC on IIS6"
description: "Deploying ASP.NET MVC applications to IIS6 requires specific configuration steps. This guide addresses common setup issues."
pubDatetime: 2012-03-12T00:00:00-08:00
tags: ["iis", "mvc", "aspnet"]
draft: false
source: "https://georgediab.com/2012/03/12/mvc-on-iis6/"
---

Deploying ASP.NET MVC applications to IIS6 requires specific configuration steps. This guide addresses common setup issues.

## Configuration Steps

1. **Create Application in IIS**
   - Right-click the folder in IIS and select Properties
   - Navigate to the Directory tab

2. **Add Application Mapping**
   - Click the Configuration button
   - Check for an existing .mvc extension mapping
   - If absent, click Add

3. **Set Executable Path**
   - Enter: `C:\WINDOWS\Microsoft.NET\Framework\v4.0.30319\aspnet_isapi.dll`
   - Note: Path may vary by server; locate the dll and reference accordingly
   - **Uncheck** "Verify that file exists"

4. **Add Wildcard Mapping**
   - Click Insert to add wildcard mapping
   - Use the same dll path from step 3
   - **Uncheck** "Verify that file exists"

Once completed, the MVC application should route properly.

## Reference

- [Phil Haack's IIS 6 Walkthrough](http://haacked.com/archive/2008/11/26/asp.net-mvc-on-iis-6-walkthrough.aspx)
