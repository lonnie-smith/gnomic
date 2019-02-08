const express = require('express');
const bodyParser = require('body-parser');

const escapeData = require('./util/escapeData');
const errorMessage = require('./util/errorMessage');
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

const WEB_CACHE_BUSTER = (new Date()).valueOf();
const DATA_CACHE_TIMEOUT = 60 * 1000; // one minute
let dataCache = null;
let nextCacheUpdate = null;

const api = require('./api')(WEB_CACHE_BUSTER);


app.use('/assets', express.static('server/static/assets', {
    fallthrough: false,
    index: false,
}));

app.use('/api', api);

app.get('/', (req, res) => {
    updateData()
        .then(dataCache => {
            res.render('index', {
                cacheBuster: WEB_CACHE_BUSTER,
                ...dataCache,
            });
        })
        .catch(err => errorMessage(err, res));
});

app.listen(port);
console.log('Gnomic server started on port', port);

async function updateData() {
    const now = (new Date());
    if (dataCache || now > nextCacheUpdate) {
        const fragments = await Fragment.list();
        const works = await Work.list();
        const tags = await Tag.list();
        dataCache = {
            fragments: escapeData(fragments),
            works: escapeData(works),
            tags: escapeData(tags),
        };
        nextCacheUpdate = new Date(now.valueOf() + DATA_CACHE_TIMEOUT);
        return dataCache;
    } else {
        return Promise.resolve(dataCache);
    }
}
