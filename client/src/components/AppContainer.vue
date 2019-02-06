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

import { store, actions, mutations } from '../scripts/store';
import { router } from '../scripts/router';

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
