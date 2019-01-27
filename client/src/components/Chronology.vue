<template>
    <div>
        CHRONOLOGY
        <ol>
            <li
                v-for="fragment of fragments"
                :key="fragment.id"
            >
                <gnomic-fragment :fragment="fragment" />
            </li>
        </ol>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { store, mutations, actions } from '../scripts/store';
import Fragment from './Fragment.vue';

export default {
    store,
    components: {
        'gnomic-fragment': Fragment,
    },
    computed: {
        ...mapState({
            fragments: state => {
                return state.fragmentOrder.map(id => {
                    return state.fragments[id];
                });
            },
        }),
    },
    created() {
        console.log('FRAGMENTS', this.fragments);
    },
};
</script>