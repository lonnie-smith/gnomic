const express = require('express');
const bodyParser = require('body-parser');

const api = require('./api');
const escapeData = require('./util/escapeData');
const Fragment = require('../db/models/fragment');
const Work = require('../db/models/work');
const Tag = require('../db/models/tag');

require('env-merger')();

const port = process.env.PORT || 80;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', './server/views');
app.set('view engine', 'pug');

const CACHE_BUSTER = (new Date()).valueOf();

app.use('/assets', express.static('server/static/assets', {
    fallthrough: false,
    index: false,
}));

app.use('/api', api);

app.get('/', (req, res) => {
    let fragments;
    let works;
    let tags;
    Fragment.list({})
        .then(rows => fragments = rows)
        .then(() => Work.list())
        .then(rows => works = rows)
        .then(() => Tag.list())
        .then(rows => tags = rows)
        .then(() => {
            console.log(tags.length)
            res.render('index', {
                cacheBuster: CACHE_BUSTER,
                fragments: escapeData(fragments.map(f => f.api)),
                works: escapeData(works.map(w => w.api)),
                tags: escapeData(tags.map(t => t.api)),
            });
        });
});

app.listen(port);
console.log('Gnomic server started on port', port);
