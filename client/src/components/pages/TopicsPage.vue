<template>
    <div>
        <section
            v-for="(tagGroup, index) of tagGroups"
            :key="index"
        >
            <h2>{{ tagGroup.title }}</h2>
            <ul>
                <li
                    v-for="tag of tagGroup.tags"
                    :key="tag.id"
                >
                    <gnomic-fragments-link
                        :query="{ tag: tag.tag }"
                    >
                        {{ tag.tag }}
                    </gnomic-fragments-link>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { sortBy } from 'lodash';

import { caseInsensitive } from '../../scripts/util/sortComparators';
import { store, mutations, actions } from '../../scripts/store';
import FragmentsLink from '../FragmentsLink.vue';

const TAG_TYPE_MAP = {
    person: 'People',
    work: 'Titles',
    topic: 'Topics',
    period: 'Eras',
};

export default {
    store,
    components: {
        'gnomic-fragments-link': FragmentsLink,
    },
    computed: {
        ...mapState({
            tagGroups: state => {
                const groups = [];
                const dict = {};
                const tags = sortBy(state.tags, [tag => caseInsensitive(tag.tag)]);
                tags.forEach(tag => {
                    const index = dict[tag.type];
                    let group;
                    if (index != null) {
                        group = groups[index];
                    } else {
                        dict[tag.type] = groups.length;
                        group = {
                            title: TAG_TYPE_MAP[tag.type],
                            tags: [],
                        };
                        groups.push(group);
                    }
                    group.tags.push(tag);
                });
                return groups;
            },
        }),
    },
};

</script>
