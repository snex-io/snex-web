# SNEX Service

Official repo and issue tracker for SNEX Service and Website.

Please file issues on repo issue tracker.

### Known bugs

There is a delay between 0ms and 100ms in the network request generateds on `touchstart` in Google Chrome. This delay does not occur on `touchmove` or `touchend`. This creates an uncanny experience when using SNEX on Google Chrome on Android. That bug has been filed here: 
https://bugs.chromium.org/p/chromium/issues/detail?id=639300. Please give feedback to Chromium team if you care about this bug and can reproduce.

Reproduction cases
* [Using setTimeout](https://github.com/pomle/chrome-touchstart-delay-repr/tree/be098fc2b312befd1d06ba18d03464e35b02755e)
* [Using network request](https://github.com/pomle/chrome-touchstart-delay-repr/tree/network-example)
