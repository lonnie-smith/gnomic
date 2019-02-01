import { api } from '../api';
import { types as mutations } from './mutations';

export const types = {
    FETCH_FRAGMENTS_CONTENT: 'fetchFragmentsContent',
};

export const actions = {
    async [types.FETCH_FRAGMENTS_CONTENT]({ commit, state }, { fragmentIds }) {
        const idsToFetch = fragmentIds.filter(id => {
            const fragment = state.fragments[id];
            return fragment && fragment.content == null;
        });
        if (idsToFetch.length === 0) {
            return;
        }
        commit(mutations.FETCH_FRAGMENTS_CONTENT);
        try {
            const fragments = await api.fetchFragmentsByIds(idsToFetch);
            commit(mutations.FETCHED_FRAGMENTS_CONTENT, {
                fragments,
            });
        } catch (error) {
            commit(mutations.FETCHED_FRAGMENTS_CONTENT, { error });
        }
    },
};
