<template>
    <div>
        <nav>
            <router-link to="/chronology">Chronology</router-link>
            <router-link to="/works">Works</router-link>
            <router-link to="/topics">Topics</router-link>
        </nav>
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import VueRouter from 'vue-router';

import { store, actions, mutations } from '../scripts/store';
import Chronology from './Chronology.vue';
import Works from './Works.vue';
import Topics from './Topics.vue';

const routes = [
    { path: '/', redirect: '/chronology' },
    { path: '/chronology', component: Chronology, props: true },
    { path: '/works', component: Works },
    { path: '/topics', component: Topics },
];

const router = new VueRouter({
    routes,
    mode: 'hash',
});

export default {
    store,
    router,
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
            setWorks: mutations.SET_WORKS,
        }),
    },
};

</script>