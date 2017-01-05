const crypto = require('crypto');

function bytes(len = 32) {
  return crypto.randomBytes(len);
}

function pretty(len = 6, chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZ023456789') {
  const rand = bytes(len);
  const buff = new Array(len);

  let cursor = 0, pool = chars.length;
  for (let i = 0; i < len; ++i) {
    cursor += rand[i];
    buff[i] = chars[cursor % pool];
  }

  return buff.join('');
}

module.exports = {
  bytes,
  pretty,
}
