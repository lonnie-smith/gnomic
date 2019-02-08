module.exports = function extractPlainText() {
    return function(tree, file) {
        const strings = [];
        nodeToArray(tree, strings);
        const plainText = strings.join(' ');
        file.data.plainText = plainText;
    };
};

function nodeToArray(node, strings) {
    if (node.type === 'text') {
        strings.push(node.value);
        return;
    }
    if (node.children) {
        node.children.forEach(child => nodeToArray(child, strings));
    }
}
