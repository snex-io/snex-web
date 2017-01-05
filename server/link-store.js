function upper(str) {
  return str.toUpperCase();
}

class Store extends Map
{
  get(key) {
    return super.get(upper(key));
  }

  has(key) {
    return super.has(upper(key));
  }

  set(key, value) {
    return super.set(upper(key), value);
  }
}

const LINK_STORE = new Store();

module.exports = LINK_STORE;