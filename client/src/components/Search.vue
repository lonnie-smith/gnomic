<template>
    <div>
        <input
            type="search"
            :disabled="!indexReady"
            v-model.trim="query"
        />
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import lunr from 'lunr';

import { store, actions } from '../scripts/store';

export default {
    store,
    data() {
        return {
            query: '',
            searchDebounce: null,
            indexReady: false,
            fullTextResults: [],
        };
    },
    computed: {
        ...mapState({
            index: state => {
                if (state.fullTextIndex.index) {
                    return lunr.Index.load(state.fullTextIndex.index);
                } else {
                    return null;
                }
            },
            fragments: state => state.fragments,
            works: state => state.works,
            tags: state => state.tags,
        }),
    },
    watch: {
        query() {
            clearTimeout(this.searchDebounce);
            this.searchDebounce = setTimeout(() => this.doSearch(), 250);
        }
    },
    created() {
        this.fetchIndex().then(() => {
            this.indexReady = true;
        });
    },
    methods: {
        ...mapActions({
            fetchIndex: actions.FETCH_FULL_TEXT_INDEX,
        }),
        doSearch() {
            if (!this.indexReady) {
                return;
            }
            const results = this.index.search(this.query);
            console.log(results);
        }
    },
}

</script>