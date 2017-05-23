# What's New, Reddit?

A web extension by Mr Speaker (@mrspeaker)

Never hit that F5 key again.

Life coming at you too fast? Can't keep up with it all? You need *What's New, Reddit*.

Automatically updates and visually highlights what posts are new. Show's new posts since your last visit and how many new comments there are on each post.

## Install

* [Chrome WebStore](https://chrome.google.com/webstore/detail/whats-new-reddit/lmfhahhaacglnpjlfincodafedalgeai)
* [Firefox Add-On](https://addons.mozilla.org/en-US/firefox/addon/whats-new-reddit/) (currently waiting for approval)

## Building

If you want to play with the source and/or build for the stores.

### Chrome

#### For testing...

* window -> extensions -> Pack extension...
* Choose manifest.json directory, add private key.

#### For deploying...

* Copy key to dir, rename as key.pem.
* Zip it up.
* upload to https://chrome.google.com/webstore/developer/dashboard/

### Firefox

#### For testing

* about:debugging

#### For deploying

1. zip up your add-on's files
2. upload your zip to [AMO](https://addons.mozilla.org/en-US/developers/addons) for signing and review, and choose whether to publish it in AMO or not
3. if you chose not to publish on AMO, retrieve the signed add-on, and publish it yourself
