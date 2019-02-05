<template>
    <div class="fragment__fragmentList__item">
        <gnomic-fragment-content
            :content-html="fragment.content"
            class="fragment__fragmentList__item__content"
        />
        <ul class="fragment__fragmentList__item__tags">
            <li
                v-for="tag of tags"
                :key="tag.id"
            >
                <gnomic-fragments-link
                    v-if="tag.fragmentIds.length > 1"
                    :query="{ tag: tag.tag }"
                >
                    {{ tag.tag }} ({{ tag.fragmentIds.length }})
                </gnomic-fragments-link>
                <span
                    v-if="tag.fragmentIds.length <= 1"
                >
                    {{ tag.tag }}
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { sortBy } from 'lodash';

import { caseInsensitive } from '../../scripts/util/sortComparators';
import { store } from '../../scripts/store';
import FragmentContent from './FragmentContent.vue';
import FragmentsLink from '../FragmentsLink.vue';

export default {
    store,
    components: {
        'gnomic-fragment-content': FragmentContent,
        'gnomic-fragments-link': FragmentsLink,
    },
    props: {
        fragment: {
            type: Object,
            required: true,
        },
        work: {
            type: Object,
            required: true,
        },
    },
    computed: {
        ...mapState({
            allTags: state => state.tags,
        }),
        date() {
            return (new Date(this.fragment.date))
                .toLocaleDateString();
        },
        tags() {
            const author = `${this.work.authorFirstName}`
                + ` ${this.work.authorLastName}`;
            // NB: don't show the title or author of this work as tags.
            const tags = this.fragment.tagIds
                .map(tagId => this.allTags[tagId])
                .filter(tag => {
                    return tag.tag !== author
                        && tag.tag !== this.work.title
                });
            return sortBy(tags, [tag => caseInsensitive(tag.tag)]);
        },
    },
};
</script>
