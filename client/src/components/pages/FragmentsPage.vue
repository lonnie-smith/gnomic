<template>
    <gnomic-fragment-list
        :fragments="filteredFragments"
    />
</template>

<script>
import { mapState } from 'vuex';
import { sortBy } from 'lodash';

import { store, mutations, actions } from '../../scripts/store';
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
        work: {
            type: String,
            'default': null,
        },
    },
    computed: {
        ...mapState({
            filteredFragments(state) {
                const frags = Object.values(state.fragments)
                    .filter(fragment => {
                        if (this.slug) {
                            if (fragment.slug !== this.slug) {
                                return false;
                            }
                        }
                        if (this.authorName) {
                            if (fragment.work.authorFirstName !== this.authorName.first
                                || fragment.work.authorLastName !== this.authorName.last) {
                                return false;
                            }
                        }
                        if (this.work) {
                            if (fragment.work.id !== parseInt(this.work, 10)) {
                                return false;
                            }
                        }
                        if (this.tag) {
                            let found = false;
                            for (const tag of fragment.tags) {
                                if (tag.tag === this.tag) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                return false;
                            }
                        }
                        return true;
                    });
                return sortBy(
                    Object.values(frags), ['date']);
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
    },
};

</script>