const controllers = require('./controllers');

const URL = '';
const SNEX_LIB = 'https://cdn.snex.io/snex.latest.min.js';

module.exports = {
    controllers: Object.keys(controllers),
    URL_SELF: process.env.URL_SELF || URL,
    URL_SNEX_LIB: process.env.URL_SNEX_LIB || SNEX_LIB,
};
