(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof module === 'object' && module.exports) {
      module.exports = factory();
  } else {
      root.snex = factory();
  }
}(this, function() {
  const snex = {
    URL: 'http://snex.io',

    createSession: function createSession(key, id, pad = 'nes') {
      const request = new Request(snex.URL + '/api/v1/session', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          key,
          id,
          type: pad,
        }),
      });

      return fetch(request).then(r => r.json());
    }
  };

  return snex;
}));
