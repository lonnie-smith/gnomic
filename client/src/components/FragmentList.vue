<template>
    <div>
        <gnomic-composite-fragment
            v-for="(group, index) of fetchedCompositeFragments"
            :key="index"
            :fragments="group.fragments"
            :work="group.work"
        />
        <gnomic-loading-indicator
            :is-loading="isFetchingFragments"
        />
    </div>
</template>

<script>
import { sortBy } from 'lodash';
import { mapState, mapActions } from 'vuex';

import { store, actions } from '../scripts/store';
import CompositeFragment from './CompositeFragment.vue';
import LoadingIndicator from './LoadingIndicator.vue';

export default {
    store,
    components: {
        'gnomic-composite-fragment': CompositeFragment,
        'gnomic-loading-indicator': LoadingIndicator,
    },
    props: {
        fragments: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            compositeFragments: [],
            fetchedCompositeFragments: [],
            scrollContainer: null,
        };
    },
    computed: {
        ...mapState({
            works: state => state.works,
            isFetchingFragments: state => state.isFetchingFragments,
        }),
    },
    watch: {
        fragments(newVal, oldVal) {
            // Fetching triggers a fragments change; test to make sure
            // that there has been a change that requires rebuilding the page.
            const newKeys = Object.keys(newVal);
            if (newKeys.length !== Object.keys(oldVal).length) {
                for (const id of newKeys) {
                    if (!oldVal[id]) {
                        this.setCompositeFragments();
                        this.fetchFragments();
                        break;
                    }
                }
            }
        },
    },
    mounted() {
        this.scrollContainer = document.querySelector('.pageGrid__body');
        this.setCompositeFragments();
        this.fetchFragments();
        this.scrollContainer.addEventListener('scroll', this.scrollHandler);
    },
    beforeDestroy() {
        this.scrollContainer.removeEventListener('scroll', this.scrollHandler);
        this.scrollToTop();
    },
    methods: {
        ...mapActions({
            fetch: actions.FETCH_FRAGMENTS_CONTENT,
        }),
        fetchFragments() {
            const startIdx = this.fetchedCompositeFragments.length;
            if (startIdx >= this.compositeFragments.length) {
                return;
            }
            const endIdx = startIdx + 1;
            const fragmentIds = [];
            this.compositeFragments.slice(startIdx, endIdx)
                .forEach(group => {
                    fragmentIds.push(
                        ...group.fragments.map(f => parseInt(f.id, 10)));
                });
            this.fetch({ fragmentIds })
                .then(() => this.setCompositeFragments());
        },
        setCompositeFragments() {
            this.scrollToTop();
            const fragments = sortBy(
                Object.values(this.fragments), ['date', 'workId'])
                .reverse();
            const groups = [];
            const groupDict = {};
            fragments.forEach(fragment => {
                const groupIndex = groupDict[fragment.workId];
                let group;
                if (groupIndex != null) {
                    group = groups[groupIndex];
                } else {
                    group = {
                        work: this.works[fragment.workId],
                        fragments: [],
                    };
                    groups.push(group);
                    groupDict[fragment.workId] = groups.length - 1;
                }
                group.fragments.push(fragment);
            });
            this.compositeFragments = groups;
            this.fetchedCompositeFragments = groups.filter(compositeFrag => {
                return compositeFrag.fragments[0].content;
            });
        },
        scrollHandler() {
            const cont = this.scrollContainer;
            const atBottom = cont.scrollTop + cont.offsetHeight === cont.scrollHeight;
            if (atBottom && !this.isFetchingFragments) {
                this.fetchFragments();
            }
        },
        scrollToTop() {
            if (this.scrollContainer) {
                this.scrollContainer.scrollTop = 0;
            }
        },
    },
};
</script>
