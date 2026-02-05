---
title: "Save (Not Permitted)"
description: "When modifying table structures in SQL Designer, the management tools may prevent you from saving changes that require table recreation. Here's the workaround."
pubDatetime: 2011-08-17T00:00:00-08:00
tags: ["sql", "sql-server", "tips"]
draft: false
source: "https://georgediab.com/2011/08/17/save-not-permitted/"
---

When modifying table structures in SQL Designer—such as reordering columns or changing data types—the management tools may prevent you from saving changes that require table recreation. The error message states: "You have either made changes to a table that can't be re-created or enabled the option Prevent saving changes that require the table be re-created."

Here's a workaround solution, though I assume no responsibility for data loss if you fail to back up your tables before attempting it.

## The Fix

In SQL Management Studio:

1. Navigate to **Tools → Options**
2. Uncheck the checkbox shown in the screenshot below
3. Click **Ok**

![Prevent saving changes option](/posts/save-not-permitted/sql-prevent-saving-changes.png)

After completing your modifications, consider re-enabling this setting to prevent accidental changes.

## Alternative Approach

Rather than using the GUI workaround, you can write an ALTER statement using T-SQL, which avoids this issue entirely—though deadlines often make this less practical.
