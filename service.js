const express = require('express');
const compression = require('compression');
const api = require('./server/api');

const PEERJS_API_KEY = process.env.PEERJS_API_KEY || 'lwjd5qra8257b9';
const PORT = process.env.PORT || 8080;

const controllers = {
    'nes': {
        title: 'Nintendo 8-bit',
    },
    'snes': {
        title: 'Super Nintendo',
    },
    'genesis': {
        title: 'Sega Genesis',
    },
};

const app = express();

app.use(compression());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.set('views', 'server/templates');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/:controller', (req, res, next) => {
    const type = req.params.controller;
    if (!controllers.hasOwnProperty(type)) {
        next();
        return;
    }

    const controller = controllers[type];

    res.locals = {
        key: req.query.key,
        id: req.query.id,
        title: controller.title,
        controller: type,
    };

    res.render('remote');
});

app.get('/', (req, res) => {
    res.locals = {
        controllers: Object.keys(controllers),
        api_key: PEERJS_API_KEY,
    };

    res.render('front');
});

app.use('/api', api);

const server = app.listen(PORT);
server.on('listening', () => {
    const bound = server.address();
    console.info(`App running on ${bound.address}:${bound.port}`);
});
