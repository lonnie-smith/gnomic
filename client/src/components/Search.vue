<template>
    <div
        ref="container"
        class="search"
        @focusout="onFocusOut($event)"
    >
        <input
            ref="input"
            :disabled="!indexReady"
            v-model.trim="query"
            type="search"
            class="search__input"
            @keypress="onInputKeypress($event)"
        />
        <div
            v-show="showSearchResults"
            class="search__results"
        >
            <h1 class="isVisuallyHidden">Search Results</h1>
            <div
                v-if="fullTextResults.length > 0"
                class="search__results__list"
            >
                <h2 class="search__results__list__heading">
                    Fragment Text
                </h2>
                <ul class="search__results__list__body">
                    <li
                        v-for="result of fullTextResults"
                        :key="result.work.id"
                    >
                        <em>{{ result.work.authorLastName }}</em>,
                        {{ abbreviateTitle(result.work.title) }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import lunr from 'lunr';
import { sortBy } from 'lodash';

import { store, actions } from '../scripts/store';

export default {
    store,
    data() {
        return {
            query: '',
            searchDebounce: null,
            indexReady: false,
            fullTextResults: [],
            showResults: false,
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
        },
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
            const rsltGroups = this.index.search(this.query)
                .map(rslt => {
                    const frag = this.fragments[rslt.ref];
                    const work = frag && this.works[frag.workId];
                    return {
                        fragId: frag.id,
                        work,
                        score: rslt.score,
                    };
                })
                .reduce((groups, obj) => {
                    const group = groups[obj.work.id];
                    if (!group) {
                        groups[obj.work.id] = {
                            work: obj.work,
                            score: obj.score,
                            fragmentIds: [obj.fragId],
                        };
                    } else {
                        group.fragmentIds.push[obj.fragId];
                        group.score = Math.max(group.score, obj.score);
                    }
                    return groups;
                }, {});
            this.fullTextResults = sortBy(Object.values(rsltGroups), ['score']);
            this.open();
        },
        abbreviateTitle(title) {
            return title.replace(/“|”|"/g, '')
                .split(/:\s+/)[0];
        },
        loadResults(fragmentIds = null) {
            
        },
        open() {
            this.showResults = true;
        },
        close(shiftFocus = false) {
            this.showResults = false;
            if (shiftFocus) {
                this.$refs.input.focus();
            }
        },
        onFocusOut(event) {
            // if (this.$refs.container.contains(event.target)) {
            //     return;
            // } else {
            //     this.close();
            // }
        },
        onInputKeypress(event) {
            switch (event.key) {
                case 'Enter':
                    clearTimeout(this.searchDebounce);
                    this.doSearch();
                    this.loadResults();
                    break;
                case 'Escape':
                    this.close(true);
                    break;
            }
            return true;
        },

    },
};

</script>
