const extract = require('remark-extract-frontmatter');
const frontmatter = require('remark-frontmatter');
const html = require('remark-html');
const parse = require('remark-parse');
const report = require('vfile-reporter');
const stringify = require('remark-stringify');
const unified = require('unified');
const vfile = require('to-vfile');
const yaml = require('yaml').parse;

module.exports = function(filePath) {
    return new Promise((resolve, reject) => {
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
                vfile.readSync(filePath),
                (err, file) => {
                    // console.log('data', file.data);
                    // console.log(String(file));
                    if (err) {
                        console.error(report(err));
                        reject(err);
                    } else if (file.messages && file.messages.length > 0) {
                        reject(file.messages);
                    } else {
                        resolve(file);
                    };
                }
            );
    });
}
