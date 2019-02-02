<template>
    <div>
        <gnomic-composite-fragment
            v-for="(group, index) of compositeFragments"
            :key="index"
            :fragment-ids="group.fragmentIds"
            :work="group.work"
        />
    </div>
</template>

<script>
import { sortBy } from 'lodash';
import { mapState, mapActions } from 'vuex';

import { store, actions } from '../scripts/store';
import CompositeFragment from './CompositeFragment.vue';

export default {
    store,
    components: {
        'gnomic-composite-fragment': CompositeFragment,
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
                        break;
                    }
                }
            }
        },
    },
    mounted() {
        this.setCompositeFragments();
    },
    methods: {
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
                        fragmentIds: [],
                    };
                    groups.push(group);
                    groupDict[fragment.workId] = groups.length - 1;
                }
                group.fragmentIds.push(parseInt(fragment.id, 10));
            });
            this.compositeFragments = groups;
        },
        scrollToTop() {
            if (this.scrollContainer) {
                this.scrollContainer.scrollTop = 0;
            }
        },
    },
};
</script>
