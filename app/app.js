const express = require('express');
const bodyParser = require('body-parser');

const Fragment = require('../db/models/fragment');
const Work = require('../db/models/work');
const Tag = require('../db/models/tag');

require('env-merger')();

const port = process.env.PORT || 80;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', './app/views');
app.set('view engine', 'pug');

const router = express.Router();

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
    Fragment.list().then(rows => {
        fragments = rows;
    })
    .then(() => {
        res.render('index', {
            fragments,
        });
    });
});

app.listen(port);
console.log('Gnomic server started on port', port);
