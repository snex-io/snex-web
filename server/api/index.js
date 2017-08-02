const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
const random = require('../random');
const controllers = require('../controllers');

const router = express.Router();

const linkStore = require('../link-store').createStore();
const propExtract = require('../prop-extract');

router.get('/:pointer', (req, res, next) => {
    let typeOrId = req.params.pointer;
    let meta;

    linkStore.has(typeOrId)
    .then(has => {
        if (has) {
            return linkStore.get(typeOrId);
        }

        return {
          type: typeOrId,
          key: req.query.key,
          id: req.query.id,
        };
    })
    .then(meta => {
        if (!controllers.hasOwnProperty(meta.type)) {
            return next();
        }

        const controller = controllers[meta.type];

        res.locals = Object.assign({
            title: controller.title,
        }, meta);

        res.render('remote');
    });
});

router.get('/api/v1/session/:id', (req, res) => {
  const id = req.params.id;

  linkStore.has(id)
  .then(has => {
    if (!has) {
      res.statusCode = 404;
      res.end();
      return;
    }

    return linkStore.get(id);
  })
  .then(meta => {
    res.send(JSON.stringify(meta));
  });
});

router.post('/api/v1/session', bodyParser.json(), (req, res) => {
  const payload = propExtract(req.body);

  const gracePeriod = 30;
  const lifetime = 60 * 5;

  const expiresAt = moment().add(lifetime, 'seconds');

  const meta = {
    expiresAt,
    type: payload('type'),
    id: payload('id'),
  };

  const id = random.pretty(4, 'ABCDEFGHJKLMNPQRSTUVWXYZ');

  linkStore.set(id, meta, lifetime + gracePeriod)
  .then(() => {
    res.send(JSON.stringify({
      id,
      url: process.env.URL_SELF + '/' + id,
      expiresAt,
    }));
  });
});

module.exports = router;