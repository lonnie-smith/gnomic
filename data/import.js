const glob = require('glob');

const parse = require('./parse');
const store = require('./store');

require('env-merger')();
const knexConfig = require('../knexfile')[process.env.NODE_ENV];
const knex = require('knex')(knexConfig);

glob('./data/sampleData/**/*.md', (err, matches) => {
    const promises = matches.map(path => {
        return parse(path)
            .then(vfile => {
                return store(path, vfile, knex);
            });
    });
    Promise.all(promises).catch(err => {
        console.error('Error:');
        console.error(err);
    });
});
