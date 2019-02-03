<template>
    <div class="pageGrid">
        <nav class="pageGrid__header">
            <router-link
                class="link link--navLink"
                to="/chronology"
            >
                Chronology
            </router-link>
            <router-link
                class="link link--navLink"
                to="/works"
            >
                Works
            </router-link>
            <router-link
                class="link link--navLink"
                to="/topics"
            >
                Topics
            </router-link>
        </nav>
        <nav class="pageGrid__sidebarLeft">
            <router-view name="sidebar" />
        </nav>
        <main class="pageGrid__body">
            <router-view name="main"/>
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
import Timeline from './Timeline.vue';

const routes = [
    { path: '/', redirect: '/chronology' },
    {
        path: '/chronology',
        components: { main: Chronology, sidebar: Timeline },
    },
    {
        path: '/works',
        components: { main: Works },
    },
    {
        path: '/topics',
        components: { main: Topics },
    },
    {
        path: '/fragment/:slug',
        components: { main: Fragments },
        props: true,
    },
    {
        path: '/fragments',
        components: { main: Fragments, sidebar: Timeline },
        props: route => {
            return {
                ...route.query,
                workId: route.query.workId
                    ? parseInt(route.query.workId, 10)
                    : null,
            };
        },
    },
];

const router = new VueRouter({
    routes,
    mode: 'hash',
    linkActiveClass: 'isActive',
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
        },
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
