module.exports = function removeFrontmatter() {
    return function(tree, file) {
        return {
            ...tree,
            children: tree.children.filter(child => child.type !== 'yaml'),
        };
    };
};
