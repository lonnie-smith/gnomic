const fs = require('fs');
const express = require('express');

const errorMessage = require('./util/errorMessage');
const Fragment = require('../db/models/fragment');

module.exports = function(cacheBuster) {
    const router = express.Router(); /* eslint-disable-line new-cap */

    // query params: ids, workId, authorFullName (last, first), tag
    router.get('/fragments', (req, res) => {
        const query = {
            ...req.query,
            ids: req.query.ids 
                ? JSON.parse(decodeURIComponent(req.query.ids))
                : null,
        };
        Fragment.query(query)
            .then(fragments => {
                res.json(fragments);
            })
            .catch(err => errorMessage(err, res));
    });
    
    router.get('/fragment/:slug', (req, res) => {
        Fragment.getOne(req.params.slug || req.params.id)
            .then(fragment => {
                if (fragment) {
                    res.json(fragment.api);
                } else {
                    res.status(404);
                    res.send(`'${req.params.slug || req.params.id}' not found.`);
                }
            })
            .catch(err => errorMessage(err, res));
    });

    const searchIndex = fs.readFileSync(process.env.INDEX_FILE).toString();
    router.get('/searchIndex', (req, res) => {
        res.send({
            version: cacheBuster,
            index: searchIndex,
        });
    });
    return router;
};

