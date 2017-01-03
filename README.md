# snex

Official repo and issue tracker for SNEX.

Please file issues on repo issue tracker.

### Known bugs

There is a delay in the network request generated between 0 and 100 ms on touchstart in Google Chrome. That bug has been filed here: 
https://bugs.chromium.org/p/chromium/issues/detail?id=639300. Please give feedback to Chromium team if you care about this bug and can reproduce.

Reproduction cases
* [Using setTimeout](https://github.com/pomle/chrome-touchstart-delay-repr/tree/be098fc2b312befd1d06ba18d03464e35b02755e)
* [Using network request](https://github.com/pomle/chrome-touchstart-delay-repr/tree/network-example)
