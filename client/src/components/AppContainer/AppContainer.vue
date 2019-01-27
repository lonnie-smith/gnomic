<template>
    <div>
        Hello from AppContainer
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

import { store, actions, mutations } from '../../scripts/store';

export default {
    store,
    props: {
        fragments: {
            type: Array,
            required: true,
        },
        works: {
            type: Array,
            required: true,
        },
    },
    created() {
        this.setFragments(this.fragments);
        this.setWorks(this.works);
    },
    methods: {
        ...mapMutations({
            setFragments: mutations.SET_FRAGMENTS,
            setWorks: mutations.SET_FRAGMENTS,
        }),
    },
};

</script>