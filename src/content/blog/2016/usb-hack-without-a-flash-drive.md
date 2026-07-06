---
title: "A USB Hack Can Occur Even Without a Flash Drive"
description: "You might think you would never be the victim of a USB hack. At BlackHat in Las Vegas, Elie Bursztein shared the surprising results of his study."
pubDatetime: 2016-08-08T12:30:39-05:00
tags: ["security", "hardware", "privacy"]
draft: true
source: "https://tech.co/usb-hack-flash-drive-2016-08"
---

“Does dropping a USB in a parking lot really work?” was the question posed by [Elie Bursztein](https://twitter.com/elie) of Google’s Anti-Abuse Research Team when he took the stage at **[BlackHat 2016](https://www.blackhat.com/us-16/)** Las Vegas, NV. You might think you would never be the victim of a USB hack, and I hope you’re right. But after watching Bursztein’s presentation, I learned more about the various ways that computers can be harmed through the USB drive.

## Who Would Pick Up a USB Drive in a Parking Lot?

This parking lot scenario refers to the belief by hackers that end users will pick up and plug in a USB flash drive they find lying around. Yes, even a thumb drive found lying in the street – if you watched [Season 1 of *Mr. Robot*](http://www.usanetwork.com/mrrobot), you know what I’m talking about. In episode six, Darlene drops USB flash drives in the parking lot of a prison in hopes that some employee of the prison will pick up the drive and connect it to a computer inside the prison. Spoiler Alert: It works.

Who would be idiot enough to plug a random USB into a computer? It turns out, many people. Bursztein references a [study he participated in](https://www.elie.net/blog/security/concerns-about-usb-security-are-real-48-percent-of-people-do-plug-in-usb-drives-found-in-parking-lots) to identify the likelihood of a successful USB hack. The research team dropped 297 USB keys on the campus of the University of Illinois Urbana-Champaign and found that 48 percent of the drives were plugged in and the users had opened a file.

## You Don’t Need Admin Rights to Plug in a USB

USB flash drives are easy to plug in and, usually, admin rights are not needed to do so. Your curiosity can be easy to pique – especially if the drive has been labeled with “test answers” or “private”.  You might think you’re just going to look around, or even quickly format the drive to repurpose it for personal use. You would never click a random .exe. You are even savvy enough to avoid all files, like a Word document, since you already know that Word documents can contain [malicious macros](https://blogs.technet.microsoft.com/mmpc/2016/05/17/malicious-macro-using-a-sneaky-new-trick/).

Unfortunately, the risk doesn’t just start and end with the files on a device. A USB hack can begin instantly, if it has a malicious autorun payload. This will execute the moment you plug in the drive.

## A USB Hack Only Needs a Port

But maybe you’re smarter than that. Maybe you are the person who would walk right past that flash drive in the parking lot. But the risk isn’t just with these drives. Hackers can also embed the USB drive into components that need to be plugged in anyway: **the end of a keyboard plug**, for instance, can be the perfect portal to take down an entire sensitive network.

There have already been examples of hackers and researchers hosting malware packages [inside the firmware of a device like a mouse](https://www.usenix.org/conference/woot14/workshop-program/presentation/maskiewicz). Firmware is code that lives in the read-only embedded memory of a device and tells the hardware how to work. It’s meant to only run inside the device, but it’s possible to change this code for malicious purposes. Oh, and it’s not possible for antivirus programs to scan this type of code.

The takeaway? It’s time for hardware manufacturers to validate firmware in order to protect consumers from these types of exploits. In the meantime, educate anyone with access to your computers about awareness, and take precaution to block the USB ports if you are concerned about lax security.
