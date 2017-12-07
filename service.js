const express = require('express');
const compression = require('compression');
const cors = require('cors');
const api = require('./server/api');
const templateLocals = require('./server/template-locals');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(compression());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.set('views', 'server/templates');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.locals = templateLocals;

    res.render('front');
});

app.use(api);

app.use('*', (req, res) => {
    res.locals = templateLocals;

    res.statusCode = 404;
    res.render('404');
});

const server = app.listen(PORT);
server.on('listening', () => {
    const bound = server.address();
    console.info(`App running on ${bound.address}:${bound.port}`);
});
