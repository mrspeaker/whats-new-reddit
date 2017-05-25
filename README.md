# What's New, Reddit?

A web extension by Mr Speaker ([@mrspeaker](http://twitter.com/mrspeaker))

Life coming at you too fast? Can't keep up with it all? You need *What's New, Reddit*.

![screener-640](https://cloud.githubusercontent.com/assets/129330/26464043/681ad646-4154-11e7-9e62-40e53716f0aa.jpg)

Never hit that F5 key again. whats-new-reddit automatically updates and visually highlights what posts are new. Leave the page, comeback later - updates are now easy to spot. It also adds in how many new comments are new for each post.

## Install

* [Chrome WebStore](https://chrome.google.com/webstore/detail/whats-new-reddit/lmfhahhaacglnpjlfincodafedalgeai)
* [Firefox Add-On](https://addons.mozilla.org/en-US/firefox/addon/whats-new-reddit/)

## Options

![options](https://cloud.githubusercontent.com/assets/129330/26464649/8a68e006-4156-11e7-8a0b-c47750464390.png)

* Refresh Time: how frequently (in seconds) the page will auto-refresh. 
* Colors:
  * New Post: the highlight colour for new posts
  * Progress bar: the small "loading bar" at the top of the page
  * Progress edge: the "edge" line of the loading bar

## Building

If you want to play with the source code and/or build for the stores.

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
