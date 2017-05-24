# What's New, Reddit?

A web extension by Mr Speaker ([@mrspeaker](http://twitter.com/mrspeaker))

Life coming at you too fast? Can't keep up with it all? You need *What's New, Reddit*.

![screener-640](https://cloud.githubusercontent.com/assets/129330/26412713/a5b86712-4077-11e7-9c52-981cb6732524.jpg)

Never hit that F5 key again. whats-new-reddit automatically updates and visually highlights what posts are new. Leave the page, comeback later - updates are now easy to spot. It also adds in how many new comments are new for each post.

## Install

* [Chrome WebStore](https://chrome.google.com/webstore/detail/whats-new-reddit/lmfhahhaacglnpjlfincodafedalgeai)
* [Firefox Add-On](https://addons.mozilla.org/en-US/firefox/addon/whats-new-reddit/) (currently waiting for approval)

## Building

If you want to play with the source and/or build for the stores.

### Chrome

#### For testing

* window -> extensions -> Pack extension...
* Choose manifest.json directory, add private key (blank to create key).

#### For deploying

* Copy key to dir as `key.pem`.
* Zip it up.
* upload to https://chrome.google.com/webstore/developer/dashboard/

### Firefox

#### For testing

* about:debugging -> `Load Temporary Add-On`

#### For deploying

* zip up add-on files
* upload to [AMO](https://addons.mozilla.org/en-US/developers/addons) for signing and review.

