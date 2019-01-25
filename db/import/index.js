const glob = require('glob');

const parse = require('./parseFile');
const store = require('./storeFile');

const db = require('../db');

doImport();

async function doImport() {
    await db.migrate.latest();
    const paths = glob.sync('./data/sampleData/**/*.md');
    const slugs = [];
    for (const path of paths) {
        const vfile = await parse(path);
        const slug = await store(path, vfile);
        slugs.push(slug);
    }
    console.log('Imported', paths.length, 'files');

    await db('fragments')
        .whereNotIn('slug', slugs)
        .del();

    await db.destroy();
}
