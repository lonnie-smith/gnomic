<template>
    <section
        :class="{
            'fragment--noContent': !isLoaded,
        }"
        class="fragment"
        ref="intersectionObserverTarget"
    >
        <div class="fragment__header">
            <h2 class="fragment__header__title">
                {{ title.title }}
                <div
                    v-if="title.subtitle"
                    class="fragment__header__title__subtitle"
                >
                    {{ title.subtitle }}
                </div>
            </h2>
            <div class="fragment__header__byline">
                <div class="stereo">
                    <div>
                        <gnomic-fragments-link
                            :query="{
                                author: `${work.authorLastName}, `
                                    + `${work.authorFirstName}`
                            }"
                            class="link--light"
                        >
                            <span>
                                {{ work.authorFirstName }}
                                {{ work.authorLastName }}
                            </span>
                        </gnomic-fragments-link>
                        <span
                            v-if="work.publicationYear"
                            class="fragment__header__byline__year"
                        >
                            ({{ work.publicationYear }})
                        </span>
                    </div>
                    <div>{{ dates }}</div>
                </div>
            </div>
        </div>
        <div
            v-if="!isLoaded"
            class="fragment__fragmentList fragment__fragmentList--empty"
        >
            <gnomic-loading-indicator
                :is-loading="isFetching"
                :is-shown="!isLoaded || isFetching"
            />
        </div>
        <div
            v-for="fragment of fragments"
            v-else
            :key="fragment.id"
            class="fragment__fragmentList"
        >
            <gnomic-fragment
                :fragment="fragment"
                :work="work"
            />
        </div>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import { store, actions } from '../scripts/store';
import Fragment from './Fragment.vue';
import FragmentsLink from './FragmentsLink.vue';
import LoadingIndicator from './LoadingIndicator.vue';

export default {
    store,
    components: {
        'gnomic-fragment': Fragment,
        'gnomic-fragments-link': FragmentsLink,
        'gnomic-loading-indicator': LoadingIndicator,
    },
    props: {
        fragmentIds: {
            type: Array,
            required: true,
        },
        work: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            intersectionObserver: null,
            isVisible: false,
        };
    },
    computed: {
        ...mapState({
            fragments(state) {
                return this.fragmentIds.map(id => {
                    return state.fragments[id];
                });
            },
        }),
        dates() {
            let min = Infinity;
            let max = -1 * Infinity;
            this.fragments.forEach(fragment => {
                const date = fragment.date.valueOf();
                min = Math.min(min, date);
                max = Math.max(min, date);
            });
            if (min === max) {
                return (new Date(min)).toLocaleDateString();
            } else {
                return `${(new Date(min)).toLocaleDateString()}`
                    + '–'
                    + `${(new Date(max)).toLocaleDateString()}`;
            }
        },
        isFetching() {
            return this.fragments[0].isFetching || false;
        },
        isLoaded() {
            return this.fragments[0].content != null;
        },
        title() {
            const title = this.work.title;
            const titleParts = title.split(/[:]\s+/);
            if (titleParts.length > 1) {
                return { title: `${titleParts[0]}:`, subtitle: titleParts[1] };
            }
            return { title };
        },
    },
    mounted() {
        this.setIntersectionObserver();
    },
    beforeDestroy() {
        this.removeIntersectionObserver();
    },
    methods: {
        ...mapActions({
            fetch: actions.FETCH_FRAGMENTS_CONTENT,
        }),
        fetchContent() {
            const fragmentIds = this.fragments.map(f => parseInt(f.id, 10));
            this.fetch({ fragmentIds });
        },
        onIntersectionChange(entries, observer) {
            if (entries[0].isIntersecting) {
                this.isVisible = true;
                if (!this.isLoaded) {
                    const debounce = () => {
                        if (this.isVisible && !this.isFetching) {
                            this.fetchContent();
                        }
                    }
                    setTimeout(debounce, 500);
                }
            } else {
                this.isVisible = false;
            }
        },
        removeIntersectionObserver() {
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
                this.intersectionObserver = null;
            }
        },
        setIntersectionObserver() {
            const options = {
                root: null, // use base viewport
                rootMargin: '20px',
                threshold: 0.01, // trigger when 1% of target visible
            };
            this.intersectionObserver = new IntersectionObserver(
                this.onIntersectionChange.bind(this), options);
            this.intersectionObserver.observe(this.$refs.intersectionObserverTarget);
        },


    },
};
</script>
