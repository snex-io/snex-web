function propExtractor(object) {
  return function (path) {
    const parts = path.split('.');
    let value = object;
    while (parts.length) {
      const next = parts.pop();
      if (!value[next]) {
        throw new TypeError(`Missing prop ${path} from ` + JSON.stringify(object));
      }
      value = value[next];
    }
    return value;
  }
}

module.exports = propExtractor;
