/* eslint-disable no-param-reassign */
export const types = {
    SET_FRAGMENTS: 'setFragments',
    SET_TAGS: 'setTags',
    SET_WORKS: 'setWorks',
};

export const mutations = {
    [types.SET_FRAGMENTS](state, fragments) {
        state.fragments = fragments.reduce((dict, fragment) => {
            dict[fragment.id] = {
                ...fragment,
                date: new Date(fragment.date),
            };
            return dict;
        }, {});
    },

    [types.SET_WORKS](state, works) {
        state.works = works.reduce((dict, work) => {
            dict[work.id] = {
                ...work,
                date: new Date(work.date),
            };
            return dict;
        }, {});
    },

    [types.SET_TAGS](state, tags) {
        state.tags = tags.reduce((dict, tag) => {
            dict[tag.id] = tag;
            return dict;
        }, {});
    },
};
