<template>
    <div>
        <h1
            v-if="header"
            class="hdg hdg__1"
            v-html="header"
        />
        <gnomic-fragment-list
            :fragments="filteredFragments"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { store, mutations, actions } from '../../scripts/store';
import { filterFragments } from '../../scripts/util/filterFragments';
import FragmentList from '../FragmentList.vue';

export default {
    store,
    components: {
        'gnomic-fragment-list': FragmentList,
    },
    props: {
        slug: {
            type: String,
            'default': null,
        },
        tag: {
            type: String,
            'default': null,
        },
        author: {
            type: String, // last, first
            'default': null,
        },
        workId: {
            type: Number,
            'default': null,
        },
        ids: {
            type: Array,
            'default': () => [],
        },
    },
    data() {
        return {
            filteredFragments: {},
        };
    },
    computed: {
        ...mapState({
            fragments: state => state.fragments,
            tags: state => state.tags,
            works: state => state.works,
            title(state) {
                if (this.workId) {
                    return state.works[this.workId].title;
                }
                return null;
            },
        }),
        authorName() {
            if (!this.author) {
                return null;
            }
            const names = this.author.split(/,\s+/);
            return {
                first: names[1],
                last: names[0],
            };
        },
        header() {
            if (this.workId != null && !this.author && !this.tag) {
                return null;
            }
            let header = 'Fragments';
            if (this.title) {
                header = `${header} from <em>${this.title}</em>`;
            } else if (this.author) {
                const [last, first] = this.author.split(/,\s+/);
                header = `${header} from works by <em>${first} ${last}</em>`;
            }
            if (this.tag) {
                header = `${header} tagged <em>${this.tag}</em>`;
            }
            return header;
        },
    },
    watch: {
        slug() {
            this.setFilteredFragments();
        },
        tag() {
            this.setFilteredFragments();
        },
        author() {
            this.setFilteredFragments();
        },
        workId() {
            this.setFilteredFragments();
        },
        ids() {
            this.setFilteredFragments();
        },
    },
    mounted() {
        this.setFilteredFragments();
    },
    methods: {
        setFilteredFragments() {
            this.filteredFragments = filterFragments({
                fragments: this.fragments,
                works: this.works,
                tags: this.tags,
                slug: this.slug,
                authorName: this.authorName,
                workId: this.workId,
                tag: this.tag,
                ids: this.ids,
            });
        },
    },
};

</script>
