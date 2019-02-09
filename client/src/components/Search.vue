<template>
    <div
        ref="container"
        class="search"
    >
        <input
            ref="input"
            :disabled="!indexReady"
            v-model.trim="query"
            type="search"
            class="search__input"
            @keydown="onInputKeypress($event)"
        />
        <div
            v-show="showResults"
            class="search__results"
        >
            <h1 class="isVisuallyHidden">Search Results</h1>
            <div
                v-if="tagResults.length > 0"
                class="search__results__list"
            >
                <h2 class="search__results__list__heading">
                    Tags
                </h2>
                <ul class="search__results__list__body">
                    <li
                        v-for="result of tagResults"
                        :id="`search_result_${result.resultIndex}`"
                        :key="result.tag.id"
                        role="button"
                        tabindex="-1"
                        @click="onResultClick(result)"
                        @keydown="onResultKeypress($event, result)"
                    >
                        <span class="link link--subtle">
                            <strong>{{ result.tag.tag }}</strong>
                        </span>
                    </li>
                </ul>
            </div>
            <div
                v-if="workResults.length > 0"
                class="search__results__list"
            >
                <h2 class="search__results__list__heading">
                    Works
                </h2>
                <ul class="search__results__list__body">
                    <li
                        v-for="result of workResults"
                        :id="`search_result_${result.resultIndex}`"
                        :key="result.work.id"
                        role="button"
                        tabindex="-1"
                        @click="onResultClick(result)"
                        @keydown="onResultKeypress($event, result)"
                    >
                        <span class="link link--subtle">
                            <strong>{{ result.work.title }}</strong>
                        </span>
                    </li>
                </ul>
            </div>
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
                        :id="`search_result_${result.resultIndex}`"
                        :key="result.work.id"
                        role="button"
                        tabindex="-1"
                        @click="onResultClick(result)"
                        @keydown="onResultKeypress($event, result)"
                    >
                        <span class="link link--subtle">
                            <strong>{{ result.work.authorLastName }}</strong>,
                            {{ abbreviateTitle(result.work.title) }}
                        </span>
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
            workResults: [],
            tagResults: [],
            showResults: false,
            resultCount: 0,
        };
    },
    computed: {
        ...mapState({
            fullTextIndex: state => {
                if (state.fullTextIndex.index) {
                    return lunr.Index.load(state.fullTextIndex.index);
                } else {
                    return null;
                }
            },
            fragments: state => state.fragments,
            works: state => state.works,
            workIndex: state => {
                return lunr(function() {
                    this.field('author');
                    this.field('title');
                    this.ref('id');

                    Object.values(state.works).forEach(work => {
                        this.add({
                            id: work.id,
                            author: `${work.authorFirstName} ${work.authorLastName}`,
                            title: work.title,
                        });
                    });
                });
            },
            tags: state => state.tags,
            tagIndex: state => {
                return lunr(function() {
                    this.field('tag');
                    this.field('type');
                    this.ref('id');

                    Object.values(state.tags).forEach(tag => {
                        this.add(tag);
                    });
                });
            },
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
    mounted() {
        document.addEventListener('focusin', event => this.onLostFocus(event));
        document.addEventListener('click', event => this.onLostFocus(event));
    },
    methods: {
        ...mapActions({
            fetchIndex: actions.FETCH_FULL_TEXT_INDEX,
        }),
        doSearch() {
            const results = getSearchResults({
                workIndex: this.workIndex,
                tagIndex: this.tagIndex,
                fullTextIndex: this.fullTextIndex,
                fullTextIndexReady: this.indexReady,
                query: this.query,
                works: this.works,
                tags: this.tags,
                fragments: this.fragments,
            });
            this.fullTextResults = results.fullTextResults,
            this.workResults = results.workResults,
            this.tagResults = results.tagResults,
            this.resultCount = results.resultCount,
            this.open();
        },
        abbreviateTitle(title) {
            return title.replace(/“|”|"/g, '')
                .split(/:\s+/)[0];
        },
        loadResults(results) {
            let query;
            if (results.length > 1) {
                const ids = results.reduce((fragIds, result) => {
                    return fragIds.concat(...result.fragmentIds);
                }, []);
                query = {
                    ids: JSON.stringify(ids),
                };
            } else {
                const result = results[0];
                if (result.type === 'tag') {
                    query = {
                        tag: result.tag.tag,
                    };
                } else if (result.type === 'work') {
                    query = {
                        workId: result.work.id,
                    };
                } else {
                    query = {
                        ids: JSON.stringify(result.fragmentIds),
                    };
                }
            }
            this.$router.push({
                path: 'fragments',
                query,
            });
            setTimeout(() => this.close(true), 100);
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
        onLostFocus(event) {
            if (this.$refs.container.contains(event.target)) {
                return;
            } else {
                this.close();
            }
        },
        onInputKeypress(event) {
            switch (event.key) {
                case 'Enter':
                    clearTimeout(this.searchDebounce);
                    this.doSearch();
                    this.loadResults([
                        ...this.tagResults,
                        ...this.workResults,
                        ...this.fullTextResults,
                    ]);
                    break;
                case 'Escape':
                case 'ArrowUp':
                    this.close(true);
                    event.preventDefault();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    this.open();
                    document.querySelector('#search_result_0').focus();
                    break;
            }
            return true;
        },
        onResultKeypress(event, result) {
            switch (event.key) {
                case 'Enter':
                    this.loadResults([result]);
                    break;
                case 'Escape':
                    this.close(true);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (result.resultIndex === 0) {
                        this.close(true);
                    } else {
                        document.querySelector(`#search_result_${result.resultIndex - 1}`).focus();
                    }
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    if (result.resultIndex === this.resultCount - 1) {
                        document.querySelector('#search_result_0').focus();
                    } else {
                        document.querySelector(`#search_result_${result.resultIndex + 1}`).focus();
                    }
                    break;
            }
        },
        onResultClick(result) {
            this.loadResults([result]);
        },
    },
};

function getSearchResults({
    workIndex,
    tagIndex,
    fullTextIndex,
    works,
    tags,
    fragments,
    fullTextIndexReady,
    query,
}) {
    const workResults = getWorkResults({
        index: workIndex,
        works,
        query,
    });
    const workTitles = workResults.reduce((titles, result) => {
        titles[result.work.title] = true;
        return titles;
    }, {});
    const tagResults = getTagResults({
        index: tagIndex,
        tags,
        query,
    }).filter(result => {
        return !workTitles[result.tag.tag];
    });
    let resultCt = 0;
    return {
        tagResults: tagResults.map(rslt => {
            return { ...rslt, resultIndex: resultCt++ };
        }),
        workResults: workResults.map(rslt => {
            return { ...rslt, resultIndex: resultCt++ };
        }),
        fullTextResults: getFullTextResults({
            indexReady: fullTextIndexReady,
            index: fullTextIndex,
            query,
            fragments,
            works,
        }).map(rslt => {
            return { ...rslt, resultIndex: resultCt++ };
        }),
        resultCount: resultCt,
    };
}


function getTagResults({
    index,
    tags,
    query,
}) {
    return index.search(query)
        .map(rslt => {
            const tag = tags[rslt.ref];
            return {
                type: 'tag',
                fragmentIds: tag.fragmentIds,
                tag,
                score: rslt.score,
            };
        });
}

function getWorkResults({
    index,
    works,
    query,
}) {
    return index.search(query)
        .map(rslt => {
            const work = works[rslt.ref];
            return {
                type: 'work',
                fragmentIds: work.fragmentIds,
                work,
                score: rslt.score,
            };
        });
}

function getFullTextResults({
    indexReady,
    index,
    query,
    fragments,
    works,
}) {
    if (!indexReady) {
        return;
    }
    const rsltGroups = index.search(query)
        .map(rslt => {
            const frag = fragments[rslt.ref];
            const work = frag && works[frag.workId];
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
                    type: 'fullText',
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
    return sortBy(Object.values(rsltGroups), ['score']);
}

</script>
