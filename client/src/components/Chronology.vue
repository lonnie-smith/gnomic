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
import { mapState } from 'vuex';
import { sortBy } from 'lodash';

import { store, mutations, actions } from '../scripts/store';
import CompositeFragment from './CompositeFragment.vue';

export default {
    store,
    components: {
        'gnomic-composite-fragment': CompositeFragment,
    },
    computed: {
        ...mapState({
            compositeFragments: state => {
                const fragments = sortBy(
                    Object.values(state.fragments), ['date']);
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
        }),
    },
};
</script>