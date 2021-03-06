const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const random = require('../random');
const controllers = require('../controllers');
const templateLocals = require('../template-locals');

const router = express.Router();

const linkStore = require('../link-store').createStore();
const propExtract = require('../prop-extract');

router.get('/:pointer', (req, res, next) => {
    const typeOrId = req.params.pointer;

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
        }, meta, templateLocals);

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
  const lifeTime = 60 * 10;

  const expiresAt = moment().add(lifeTime, 'seconds');

  const meta = {
    expiresAt,
    type: payload('type'),
    id: payload('id'),
  };

  const id = random.pretty(4, 'ABCDEFGHJKLMNPQRSTUVWXYZ');

  linkStore.set(id, meta, lifeTime + gracePeriod)
  .then(() => {
    res.send(JSON.stringify({
      id,
      url: process.env.URL_SELF + '/' + id,
      expiresAt,
      lifeTime,
    }));
  });
});

module.exports = router;
