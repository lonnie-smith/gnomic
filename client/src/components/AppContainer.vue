<template>
    <div class="pageGrid">
        <nav class="pageGrid__header">
            <div class="navBar">
                <div class="navBar__links">
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
                </div>
                <div class="navBar__search">
                    <gnomic-search />
                </div>
            </div>
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
import Search from './Search.vue';

export default {
    store,
    router,
    components: {
        'gnomic-search': Search,
    },
    props: {
        dataCacheVersion: {
            type: Number,
            required: true,
        },
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
        this.setDataCacheVersion(this.dataCacheVersion);
        this.setFragments(this.fragments);
        this.setTags(this.tags);
        this.setWorks(this.works);
    },
    methods: {
        ...mapMutations({
            setFragments: mutations.SET_FRAGMENTS,
            setTags: mutations.SET_TAGS,
            setWorks: mutations.SET_WORKS,
            setDataCacheVersion: mutations.SET_DATA_CACHE_VERSION,
        }),
    },
};

</script>
