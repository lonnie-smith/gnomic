const express = require('express');
const router = express.Router(); /* eslint-disable-line new-cap */

const Fragment = require('../db/models/fragment');
const Work = require('../db/models/work');
const Tag = require('../db/models/tag');

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

module.exports = router;