export const defaultState = {
    dataCacheVersion: 0,
    fragments: {},
    tags: {},
    works: {},
    fullTextIndex: {
        version: null,
        index: null,
    },
    isFetchingFullTextIndex: false,
    fullTextIndexFetchError: null,
    isFetchingFragments: false,
    fragmentsFetchError: null,
    itemInViewport: null,
    worksSort: {
        key: 'author',
        direction: 'asc',
    },
};
