const path = require('path');

const { parseAuthor } = require('../util');
const tagTypes = require('../tagTypes');
const Work = require('../models/work');
const Fragment = require('../models/fragment');
const Tag = require('../models/tag');

const TAG_TYPE_RX = /(.*?)\s+\[(.*)\]/;
const PUB_YEAR_RX = /(.*?)\s+\((.*?)\)$/;

module.exports = async function(filePath, vfile) {
    const slug = getSlug(filePath);
    const authorName = getAuthor(filePath, vfile);
    const title = getTitle(filePath, vfile);
    const date = getDate(filePath, vfile);
    const url = getUrl(filePath, vfile);
    const tags = getTags(filePath, vfile)
        .concat(
        {
            tag: `${authorName.first} ${authorName.last}`,
            type: 'person',
        },
        {
            tag: title.title,
            type: 'work',
        });

    const work = new Work({
        authorFirstName: authorName.first,
        authorLastName: authorName.last,
        publicationYear: title.pubYear,
        title: title.title,
        url,
    });

    const tagModels = tags.map(t => {
        return new Tag(t);
    });

    const fragment = new Fragment({
        slug,
        work,
        date,
        content: vfile.contents,
        tags: tagModels,
    });
    await fragment.save();

    return fragment.slug;
};

function getSlug(filePath) {
    return encodeURIComponent(
        path.parse(filePath).name);
}

function getAuthor(filePath, vfile) {
    const author = vfile.data
        && vfile.data.author;
    if (!author) {
        throw new Error(`Missing author metadata in ${filePath}.`);
    }

    let name;
    try {
        name = parseAuthor(author, true);
    } catch (e) {
        throw new Error(`Could not parse author name in ${filePath}.`);
    }
    return name;
}

function getTitle(filePath, vfile) {
    const title = vfile.data
        && vfile.data.title;
    if (!title) {
        throw new Error(`Missing title metadata in ${filePath}`);
    }

    const match = title.match(PUB_YEAR_RX);
    if (!match) {
        return { title };
    }    else {
        return { title: match[1], pubYear: match[2] };
    }
}

function getDate(filePath, vfile) {
    const dateStr = vfile.data
        && vfile.data.date;
    if (!dateStr) {
        throw new Error(`Missing date in ${filePath}`);
    }

    return new Date(dateStr);
}

function getUrl(filePath, vfile) {
    return vfile.data && vfile.data.url || null;
}

function getTags(filePath, vfile) {
    const tags = vfile.data
        && vfile.data.tags;
    if (!tags) {
        return [];
    }
    return tags.map(tag => {
        const match = tag.match(TAG_TYPE_RX);
        if (!match) {
            return { tag, type: 'topic' };
        }
        let type = match[2].toLowerCase();
        if (!tagTypes.includes(type)) {
            console.error(`Invalid tag type ${type}`);
            type = 'topic';
        }

        return {
            tag: match[1],
            type,
        };
    });
}
