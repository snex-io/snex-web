const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
const random = require('../random');

const router = express.Router();

const linkStore = require('../link-store');
const propExtract = require('../prop-extract');

router.get('/v1/session/:id', (req, res) => {
  const id = req.params.id;

  if (!links.has(id)) {
    res.statusCode = 404;
    res.end();
    return;
  }

  const meta = links.get(id);

  res.send(JSON.stringify(meta));
});

router.post('/v1/session', bodyParser.json(), (req, res) => {
  const payload = propExtract(req.body);

  const expiresAt = moment().add(5, 'minutes');

  const meta = {
    expiresAt,
    type: payload('type'),
    key: payload('key'),
    id: payload('id'),
  };

  const id = random.pretty(4, 'ABCDEFGHJKLMNPQRSTUVWXYZ');

  linkStore.set(id, meta);

  res.send(JSON.stringify({
    id,
    url: process.env.URL_SELF + '/' + id,
    expiresAt,
  }));
});

module.exports = router;