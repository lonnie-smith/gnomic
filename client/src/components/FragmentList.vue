<template>
    <div>
        <section
            v-for="(group, index) of compositeFragments"
            :key="index">
            <gnomic-composite-fragment
                :fragments="group"
            />
        </section>
    </div>
</template>

<script>
import { sortBy } from 'lodash';

import CompositeFragment from './CompositeFragment.vue';

export default {
    components: {
        'gnomic-composite-fragment': CompositeFragment,
    },
    props: {
        fragments: {
            type: Array,
            required: true,
        },
    },
    computed: {
        compositeFragments() {
            const fragments = sortBy(
                Object.values(this.fragments), ['date'])
                .reverse();
            const groups = [];
            const groupDict = {};
            fragments.forEach(fragment => {
                let groupIndex = groupDict[fragment.work.id];
                let group;
                if (groupIndex != null) {
                    group = groups[groupIndex]
                } else {
                    group = [];
                    groups.push(group);
                    groupDict[fragment.work.id] = groups.length - 1;
                }
                group.push(fragment);
            });
            return groups;
        },
    },
};
</script>