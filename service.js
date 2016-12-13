const express = require('express');

const API_KEY = 'b0gtzdyp37ffxbt9';
const PORT = process.env.PORT || 8080;

const controllers = {
    'nes': {
        title: 'Nintendo 8-bit',
    },
};

const app = express();

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
        api_key: API_KEY,
    };

    res.render('front');
});

const server = app.listen(PORT);
server.on('listening', () => {
    const bound = server.address();
    console.info(`App running on ${bound.address}:${bound.port}`);
});
