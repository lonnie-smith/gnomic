module.exports = {
    parseAuthor(lastCommaFirst, strict = false) {
        const names = lastCommaFirst.split(/,\s+/);
        if (strict && names.length !== 2) {
            throw new Error();
        }
        return {
            first: names[1],
            last: names[0],
        };
    },
};
