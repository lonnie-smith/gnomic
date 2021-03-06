import { api } from '../api';
import { types as mutations } from './mutations';

export const types = {
    FETCH_FRAGMENTS_CONTENT: 'fetchFragmentsContent',
    FETCH_FULL_TEXT_INDEX: 'fetchFullTextIndex',
    REMOVE_ITEM_IN_VIEWPORT: 'removeItemInViewport',
    SET_ITEM_IN_VIEWPORT: 'setItemInViewport',
};

const itemsInViewport = {};

export const actions = {
    async [types.FETCH_FRAGMENTS_CONTENT]({ commit, state }, { fragmentIds }) {
        const idsToFetch = fragmentIds.filter(id => {
            const fragment = state.fragments[id];
            return fragment && fragment.content == null;
        });
        if (idsToFetch.length === 0) {
            return;
        }
        commit(mutations.FETCH_FRAGMENTS_CONTENT, fragmentIds);
        try {
            const fragments = await api.fetchFragmentsByIds(idsToFetch);
            commit(mutations.FETCHED_FRAGMENTS_CONTENT, {
                fragments,
            });
        } catch (error) {
            console.error(error);
            commit(mutations.FETCHED_FRAGMENTS_CONTENT, { error });
        }
    },

    async [types.FETCH_FULL_TEXT_INDEX]({ commit, state }) {
        commit(mutations.FETCH_FULL_TEXT_INDEX);
        try {
            const { version, index } = await api.fetchSearchIndex(state.dataCacheVersion);
            commit(mutations.FETCHED_FULL_TEXT_INDEX, { version, index });
        } catch (error) {
            console.error(error);
            commit(mutations.FETCHED_FULL_TEXT_INDEX, { error });
        }
    },

    [types.SET_ITEM_IN_VIEWPORT]({ commit }, { itemId, yOffset }) {
        itemsInViewport[itemId] = yOffset;
        updateItemInViewport(commit);
    },

    [types.REMOVE_ITEM_IN_VIEWPORT]({ commit }, { itemId }) {
        delete itemsInViewport[itemId];
        updateItemInViewport(commit);
    },
};

// Set state.itemInViewport to the currently present item in viewport
// with the lowest yOffset.
let viewportDebounce = null;
function updateItemInViewport(commit) {
    clearTimeout(viewportDebounce);
    viewportDebounce = setTimeout(() => {
        const itemId = Object.keys(itemsInViewport)
            .reduce((minId, id) => {
                const yOffset = itemsInViewport[id];
                const minOffset = itemsInViewport[minId];
                if (minOffset == null || yOffset < minOffset) {
                    return id;
                } else {
                    return minId;
                }
            }, null);
        commit(mutations.SET_ITEM_IN_VIEWPORT, itemId);
    }, 50);
}
