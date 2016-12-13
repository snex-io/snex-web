const express = require('express');
const request = require('request');
const router = express.Router();

const BITLY_TOKEN = process.env.BITLY_TOKEN;

router.get('/v1/link', (req, res) => {
  const url = `https://api-ssl.bitly.com/v3/shorten?access_token=${BITLY_TOKEN}`
    + '&longUrl=' + encodeURIComponent(req.query.url);

  request(url, function (error, response, body) {
    res.send(body);
  });
});

module.exports = router;