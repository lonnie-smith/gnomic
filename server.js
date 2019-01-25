const express = require('express');
const bodyParser = require('body-parser');

require('env-merger')();

const port = process.env.PORT || 80;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'hello world!' });
});

app.use('/api', router);

app.listen(port);
console.log('Gnomic server started on port', port);
