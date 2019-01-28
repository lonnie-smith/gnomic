const glob = require('glob');

const parse = require('./parseFile');
const store = require('./storeFile');

const db = require('../db');
const Fragment = require('../models/fragment');

doImport();

async function doImport() {
    await db.migrate.latest();
    const paths = glob.sync('./data/**/*.md');
    const slugs = [];
    for (const path of paths) {
        const vfile = await parse(path);
        const slug = await store(path, vfile);
        slugs.push(slug);
    }
    console.log('Imported', paths.length, 'files');

    await doCleanup(slugs);

    const dbCt = await db.count('* as count')
        .from('fragments')
        .union([
            db.count('* as count')
                .from('works'),
            db.count('* as count')
                .from('tags'),
        ]);

    const [fragments, works, tags] = dbCt;
    console.log(`Database contains: ${fragments.count} fragments,`
        + ` ${works.count} works,`
        + ` ${tags.count} tags`);

    await db.destroy();
}

async function doCleanup(currentSlugs) {
    let fragmentCount;
    let worksCount;
    let tagsCount;
    return db.transaction(transaction => {
        return transaction('fragments')
            .whereNotIn('slug', currentSlugs)
            .del()
            .then(ct => {
                fragmentCount = ct;
                return Fragment.purgeWorks(transaction);
            })
            .then(ct => {
                worksCount = ct;
                return Fragment.purgeTags(transaction);
            })
            .then(ct => {
                tagsCount = ct;
                console.log(`Removed ${fragmentCount} fragments,`
                    + ` ${worksCount} works,`
                    + ` ${tagsCount} tags`);
                return Promise.resolve();
            });
    });
}
