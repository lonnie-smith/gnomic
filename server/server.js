const express = require('express');
const bodyParser = require('body-parser');

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

const router = express.Router(); /* eslint-disable-line new-cap */

// query params: work, authorFullName (last, first), tag
router.get('/fragments', (req, res) => {
    Fragment.list(req.query)
        .then(fragments => {
            res.json(fragments.map(fragment => fragment.api));
        })
        .catch(err => {
            console.error(err);
            res.status(500);
            res.send(err);
        });
});

router.get('/fragment/:slug', (req, res) => {
    Fragment.find(req.params.slug)
        .then(fragment => {
            if (fragment) {
                res.json(fragment.api);
            } else {
                res.status(404);
                res.send(`'${req.params.slug}' not found.`);
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500);
            res.send(err);
        });
});

router.get('/works', (req, res) => {
    Work.list()
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            console.error(err);
            res.status(500);
            res.send(err);
        });
});

app.use('/api', router);

app.get('/', (req, res) => {
    let fragments;
    let works;
    Fragment.list({})
        .then(rows => fragments = rows)
        .then(() => Work.list())
        .then(rows => works = rows)
        .then(() => {
            res.render('index', {
                cacheBuster: CACHE_BUSTER,
                fragments: escapeData(fragments.map(f => f.api)),
                works: escapeData(works.map(w => w.api)),
            });
        });
});

app.listen(port);
console.log('Gnomic server started on port', port);
