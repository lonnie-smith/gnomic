<template>
    <div>
        <section
            v-for="(group, index) of compositeFragments"
            :key="index"
        >
            <gnomic-composite-fragment
                :fragments="group.fragments"
                :work="group.work"
            />
        </section>
    </div>
</template>

<script>
import { sortBy } from 'lodash';
import { mapState } from 'vuex';

import { store } from '../scripts/store';
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
    computed: {
        ...mapState({
            works: state => state.works,
        }),
        compositeFragments() {
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
            return groups;
        },
    },
};
</script>
