const express = require('express');
const bodyParser = require('body-parser');

const Fragment = require('./db/models/fragment');

require('env-merger')();

const port = process.env.PORT || 80;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'pug');


const router = express.Router();

router.get('/fragments', (req, res) => {
    Fragment.list().then(rows => {
        res.json(rows);
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
