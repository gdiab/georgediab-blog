---
title: "A thing to remember about SSD drives"
description: "Switch from SATA to AHCI for better performance. This post is partly to help me remember, and to save you pulling out your hair."
pubDatetime: 2013-04-08T00:00:00-08:00
tags: ["windows", "hardware", "tips"]
draft: false
source: "https://georgediab.com/2013/04/08/a-thing-to-remember-about-ssd-drives/"
---

Switch from SATA to AHCI for better performance.

This post is partly to help me remember, and to save you pulling out your hair.

## Steps to Enable AHCI

1. Locate and then click the following registry subkey:

   ```
   HKEY_LOCAL_MACHINE\System\CurrentControlSet\Services\Msahci
   ```

2. In the right pane, right-click "Start" in the Name column, and then click Modify.

3. In the Value data box, type `0`, and then click OK.

4. On the File menu, click Exit to close Registry Editor.

5. Restart your system.

6. Change your BIOS settings for the IDE controller to use AHCI instead of SATA. Save and restart. The system should install the appropriate drivers.

**Important Note:** Although this process is straightforward, ensure you have a restore point and/or backup in place before making these changes, in case something goes wrong.
