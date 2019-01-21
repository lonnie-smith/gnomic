const extract = require('remark-extract-frontmatter');
const frontmatter = require('remark-frontmatter');
const html = require('remark-html');
const parse = require('remark-parse');
const report = require('vfile-reporter');
const stringify = require('remark-stringify');
const unified = require('unified');
const vfile = require('to-vfile');
const yaml = require('yaml').parse;

unified()
    .use(parse)
    .use(stringify)
    .use(frontmatter, [
        {
            type: 'yaml',
            marker: '-',
        },
    ])
    .use(extract, { yaml: yaml })
    .use(html)
    .process(
        vfile.readSync('./data/sampleData/dirda_browsings.md'),
        (err, file) => {
            console.log('data', file.data);
            console.log(String(file));
            console.error(report(err || file));
        }
    );


