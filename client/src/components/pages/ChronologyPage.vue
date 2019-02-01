<template>
    <gnomic-fragment-list
        :fragments="fragments"
    />
</template>

<script>
import { mapState } from 'vuex';
import { sortBy } from 'lodash';

import { store, mutations, actions } from '../../scripts/store';
import FragmentList from '../FragmentList.vue';

export default {
    store,
    components: {
        'gnomic-fragment-list': FragmentList,
    },
    computed: {
        ...mapState({
            fragments: state => state.fragments,
            tags: state => state.tags,
            works: state => state.works,
        }),
    },
};
</script>
