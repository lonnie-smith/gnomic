import { find } from 'lodash';

export function filterFragments({
    fragments,
    works,
    tags,
    slug = null,
    authorName = null,
    workId = null,
    tag = null,
}) {
    return Object.values(fragments)
        .filter(fragment => {
            if (slug) {
                if (fragment.slug !== slug) {
                    return false;
                }
            }
            if (authorName) {
                const work = works[fragment.workId];
                if (work.authorFirstName !== authorName.first
                    || work.authorLastName !== authorName.last) {
                    return false;
                }
            }
            if (workId) {
                if (fragment.workId !== workId) {
                    return false;
                }
            }
            if (tag) {
                const tagObj = find(tags, { tag });
                let found = false;
                for (const tagId of fragment.tagIds) {
                    if (tagId === tagObj.id) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return false;
                }
            }
            return true;
        })
        .reduce((dict, fragment) => {
            return {
                ...dict,
                [fragment.id]: fragment,
            };
        }, {});
}
