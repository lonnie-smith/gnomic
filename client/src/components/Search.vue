<template>
    <div>search</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import { store, actions } from '../scripts/store';

export default {
    store,
    computed: {
        ...mapState({
            fullTextIndex: state => state.fullTextIndex.index,
        }),
    },
    created() {
        this.fetchIndex();
    },
    methods: {
        ...mapActions({
            fetchIndex: actions.FETCH_FULL_TEXT_INDEX,
        }),
    },
}

</script>