const express = require('express');
const request = require('request');
const random = require('../random');

const router = express.Router();

const linkStore = require('../link-store');


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

router.post('/v1/session', (req, res) => {
  const id = random.pretty(4, 'ABCDEFGHJKLMNPQRSTUVWXYZ');

  const meta = {
    type: req.query.type,
    key: req.query.key,
    id: req.query.id,
    time: new Date(),
  };

  linkStore.set(id, meta);

  res.send(JSON.stringify({
    url: process.env.URL_SELF + '/' + id
  }));
});

module.exports = router;