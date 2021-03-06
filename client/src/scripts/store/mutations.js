/* eslint-disable no-param-reassign */
export const types = {
    SET_FRAGMENTS: 'setFragments',
    SET_TAGS: 'setTags',
    SET_WORKS: 'setWorks',
    FETCH_FRAGMENTS_CONTENT: 'fetchFragmentsContent',
    FETCHED_FRAGMENTS_CONTENT: 'fetchedFragmentsContent',
    SET_ITEM_IN_VIEWPORT: 'setItemInViewport',
    SET_WORKS_SORT: 'setWorksSort',
    SET_DATA_CACHE_VERSION: 'setDataCacheVersion',
    FETCH_FULL_TEXT_INDEX: 'fetchFullTextIndex',
    FETCHED_FULL_TEXT_INDEX: 'fetchedFullTextIndex',
};

const itemsInViewport = [];

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

    [types.FETCH_FRAGMENTS_CONTENT](state, fragmentIds) {
        const newFragments = { ...state.fragments };
        fragmentIds.forEach(id => {
            newFragments[id].isFetching = true;
        });
        Object.assign(state, {
            isFetchingFragments: true,
            fragmentsFetchError: null,
            fragments: newFragments,
        });
    },

    [types.FETCHED_FRAGMENTS_CONTENT](state, { fragments = [], error = null }) {
        Object.assign(state, {
            isFetchingFragments: false,
            fragmentsFetchError: error,
        });
        const newFragments = { ...state.fragments };
        fragments.forEach(fragment => {
            newFragments[fragment.id].content = fragment.content;
            newFragments[fragment.id].isFetching = false;
        });
        state.fragments = newFragments;
    },

    [types.SET_ITEM_IN_VIEWPORT](state, itemId) {
        state.itemInViewport = itemId;
    },

    [types.SET_WORKS_SORT](state, { key, direction }) {
        const worksSort = { ...state.worksSort };
        if (key) {
            worksSort.key = key;
        }
        if (direction) {
            worksSort.direction = direction;
        }
        state.worksSort = worksSort;
    },

    [types.SET_DATA_CACHE_VERSION](state, version) {
        state.dataCacheVersion = version;
    },

    [types.FETCH_FULL_TEXT_INDEX](state) {
        state.isFetchingFullTextIndex = true;
    },

    [types.FETCHED_FULL_TEXT_INDEX](state, { version, index, error }) {
        state.isFetchingFullTextIndex = false;
        if (error) {
            state.fullTextIndexFetchError = error;
        } else {
            state.fullTextIndex = {
                version,
                index,
            };
        }
    },
};
