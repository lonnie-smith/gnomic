const glob = require('glob');

const parse = require('./parseFile');
const store = require('./storeFile');


glob('./data/sampleData/**/*.md', (err, matches) => {
    const promises = matches.map(path => {
        return parse(path)
            .then(vfile => {
                return store(path, vfile);
            });
    });
    Promise.all(promises).catch(err => {
        console.error('Error:');
        console.error(err);
    })
    .then(() => {
        console.log('done');
    });
});
