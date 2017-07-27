const Memcached = require('memcached');

function upper(str) {
  return str.toUpperCase();
}

function createStore() {
  if (process.env.MEMCACHE_URL) {
    return new MemcacheStore(process.env.MEMCACHE_URL);
  }
  return new MemoryStore();
}

class Store
{
  get(key) {
    return this._get(upper(key)).then(val => val ? JSON.parse(val) : null);
  }

  has(key) {
    return this._has(key);
  }

  set(key, val) {
    return this._set(upper(key), JSON.stringify(val));
  }
}

class MemoryStore extends Store
{
  constructor() {
    super();
    this.store = new Map();
  }

  _get(key) {
    return Promise.resolve(this.store.get(key));
  }

  _has(key) {
    return Promise.resolve(this.store.has(key));
  }

  _set(key, value) {
    return Promise.resolve(this.store.set(key, value));
  }
}

class MemcacheStore extends Store
{
  constructor(url) {
    super();
    this.client = new Memcached([url]);
  }

  _get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, val) => {
        if (err) {
          return reject(err);
        }
        resolve(val ? val.toString('utf8') : null);
      });
    });
  }

  _has(key) {
    return this.get(key).then(val => !!val);
  }

  _set(key, value, expire = 300) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, expire, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}

module.exports = {
  MemcacheStore,
  MemoryStore,
  createStore,
};
