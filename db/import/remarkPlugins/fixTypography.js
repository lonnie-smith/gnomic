const retext = require('retext');
const visit = require('unist-util-visit');
const smartypants = require('retext-smartypants');

module.exports = function fixTypography() {
    return function(markdownAST) {
        visit(markdownAST, 'text', node => {
            const fixedText = String(
                retext()
                    .use(smartypants)
                    .processSync(node.value)
            );
            node.value = fixedText; /* eslint-disable-line */
        });
        return markdownAST;
    };
};
