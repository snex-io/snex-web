const controllers = require('./controllers');

const URL = '';
const SNEX_LIB = 'https://snex-cdn.pomle.com/snex.0.5.2-1.min.js';

module.exports = {
    controllers: Object.keys(controllers),
    URL_SELF: process.env.URL_SELF || URL,
    URL_SNEX_LIB: process.env.URL_SNEX_LIB || SNEX_LIB,
};
