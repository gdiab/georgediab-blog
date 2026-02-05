---
title: "exhale: see the path at the top of Finder"
description: "To display the complete directory path at the top of the Finder window in OSX Lion, execute these commands in the terminal."
pubDatetime: 2012-03-13T00:00:00-08:00
tags: ["finder", "osx", "unix", "mac", "tips"]
draft: false
source: "https://georgediab.com/2012/03/13/exhale-see-the-path-at-the-top-of-finder/"
---

To display the complete directory path at the top of the Finder window in OSX Lion, execute these commands in the terminal:

```bash
defaults write com.apple.finder _FXShowPosixPathInTitle -bool YES
```

```bash
killall Finder
```

**Important:** Follow the syntax precisely, as Unix commands are case-sensitive.

This modification enables visibility of the full directory path in the Finder window's title bar, providing quick reference to your current location within the file system.
