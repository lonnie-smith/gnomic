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
import Chronology from './pages/ChronologyPage.vue';
import Works from './pages/WorksPage.vue';
import Topics from './pages/TopicsPage.vue';
import Fragments from './pages/FragmentsPage.vue';

const routes = [
    { path: '/', redirect: '/chronology' },
    { path: '/chronology', component: Chronology },
    { path: '/works', component: Works },
    { path: '/topics', component: Topics },
    { path: '/fragment/:slug', component: Fragments, props: true },
    {
        path: '/fragments',
        component: Fragments,
        props: route => {
            return { ...route.query };
        }
    },
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
        tags: {
            type: Array,
            required: true,
        }
    },
    created() {
        this.setFragments(this.fragments);
        this.setTags(this.tags);
        this.setWorks(this.works);
    },
    methods: {
        ...mapMutations({
            setFragments: mutations.SET_FRAGMENTS,
            setTags: mutations.SET_TAGS,
            setWorks: mutations.SET_WORKS,
        }),
    },
};

</script>