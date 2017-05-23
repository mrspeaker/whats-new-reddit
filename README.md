# What's New, Reddit?

A webextension by Mr Speaker (@mrspeaker)

Never hit that F5 key again.

Life coming at you too fast? Can't keep up with it all? You need *What's New, Reddit*.

Automatically updates and visually highlights what posts are new. Show's new posts since your last visit and how many new comments there are on each post.

**This thing is in development... many rough edges abound**

## Install

Dunno... working on that. I still have to pack it as a chrome/firefox extension.

YOu can load it in dev mode at the moment though... In firefox, go "about:debugging" and "load extension"... find the `manifest.json` and select it. Chrome it's extension "load unpacked extension". Haven't tested Edge.


## Building

### Chrome

* window -> extensions -> Pack extension...
* Choose manifest.json directory, add private key.

### Firefox

* https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Publishing_your_WebExtension

1. zip up your add-on's files
2. create an account on AMO
3. upload your zip to AMO for signing and review, and choose whether to publish it in AMO or not
4. fix any problems that are found in review
5. if you chose not to publish on AMO, retrieve the signed add-on, and publish it yourself
