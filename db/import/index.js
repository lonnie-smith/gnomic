const glob = require('glob');
const fs = require('fs');

const parse = require('./parseFile');
const store = require('./storeFile');

const db = require('../db');
const FullTextIndex = require('./FullTextIndex');
const Fragment = require('../models/fragment');

doImport();

async function doImport() {
    const fullTextIndex = new FullTextIndex();
    await db.migrate.latest();
    const paths = glob.sync('./data/**/*.md');
    // const paths = glob.sync('./data/**/*.md').filter(f => f.indexOf('_for_hawk.md') > 0);
    const slugs = [];
    for (const path of paths) {
        let vfile;
        try {
            vfile = await parse(path);
        } catch (e) {
            console.error(`Error parsing ${path}`, e);
            return;
        }
        let slug;
        try {
            slug = await store(path, vfile, fullTextIndex);
        } catch (e) {
            console.error(`Error parsing ${path}`, e);
            return;
        }
        slugs.push(slug);
    }
    console.log('Imported', paths.length, 'files');

    await doCleanup(slugs);

    const fragmentCt = await db.count('* as count').from('fragments');
    const workCt = await db.count('* as count').from('works');
    const tagCt = await db.count('* as count').from('tags');

    console.log(`Database contains: ${fragmentCt[0].count} fragments,`
        + ` ${workCt[0].count} works,`
        + ` ${tagCt[0].count} tags`);

    await db.destroy();

    const index = fullTextIndex.index;
    const json = JSON.stringify(index);
    fs.writeFileSync(process.env.INDEX_FILE, json);
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
