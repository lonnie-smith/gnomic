/*
 * Adds additional markup structure to each fragment.
 *
 * Each fragment is wrapped in an <article>, and is subdivided into <section>s.
 *
 * If a section has a heading, the attribute data-accordion is added to the
 * section and data-accordion-header is added to the embedded section header.
 * see: https://github.com/remarkjs/remark-html#integrations
 * see: https://github.com/syntax-tree/unist#node
 */

// wrap the root node in an <article> element.
module.exports = function addArticle() {
    return function(tree, file) {
        const article = {
            type: 'article',
            data: {
                hName: 'article',
            },
            children: chunk(tree.children),
        };
        return {
            ...tree,
            children: [article],
        };
    };
};

// take root's children property and 'chunk' it, dividing article into
// sections with an optional heading.
function chunk(children) {
    const chunks = [];
    let currentChunk;
    children.forEach(child => {
        if (!currentChunk || child.type === 'heading') {
            if (currentChunk) {
                chunks.push(currentChunk);
            }
            const heading = child.type === 'heading' ? child : null;
            const children = child.type === 'heading' ? [] : [child];
            currentChunk = { heading, children };
        } else {
            currentChunk.children.push(child);
        }
    });
    if (currentChunk) {
        chunks.push(currentChunk);
    }
    return chunks.map(chunkToAccordionNode);
}

// convert object made by `chunk` to an AST node
function chunkToAccordionNode(chunk) {
    // if chunk has no heading, do not convert it into an accordion.
    if (!chunk.heading) {
        return {
            type: 'section',
            data: {
                hName: 'section',
                children: chunk.children,
            },
        };
    }

    // else, convert to an "accordion" section.
    const header = {
        ...chunk.heading,
        data: {
            ...(chunk.heading.data || {}),
        },
    };
    return {
        type: 'accordion',
        data: {
            hName: 'section',
        },
        children: [
            header,
            ...chunk.children,
        ],
    };
}
