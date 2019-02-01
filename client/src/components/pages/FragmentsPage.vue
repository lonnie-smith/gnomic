<template>
    <gnomic-fragment-list
        :fragments="filteredFragments"
    />
</template>

<script>
import { mapState } from 'vuex';
import { find } from 'lodash';

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
        workId: {
            type: Number,
            'default': null,
        },
    },
    computed: {
        ...mapState({
            filteredFragments(state) {
                return Object.values(state.fragments)
                    .filter(fragment => {
                        if (this.slug) {
                            if (fragment.slug !== this.slug) {
                                return false;
                            }
                        }
                        if (this.authorName) {
                            const work = state.works[fragment.workId];
                            if (work.authorFirstName !== this.authorName.first
                                || work.authorLastName !== this.authorName.last) {
                                return false;
                            }
                        }
                        if (this.workId) {
                            if (fragment.workId !== this.workId) {
                                return false;
                            }
                        }
                        if (this.tag) {
                            const tag = find(state.tags, { tag: this.tag });
                            let found = false;
                            for (const tagId of fragment.tagIds) {
                                if (tagId === tag.id) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                console.log('no tags found')
                                return false;
                            }
                        }
                        console.log('found matching', this.tag)
                        return true;
                    })
                    .reduce((dict, fragment) => {
                        return {
                            ...dict,
                            [fragment.id]: fragment,
                        };
                    }, {});
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
