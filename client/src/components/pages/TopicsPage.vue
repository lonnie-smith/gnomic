<template>
    <div>
        <ul class="list list--nested list--nested--l1"
            v-for="(tagGroup, index) of tagGroups"
            :key="index"
        >
            <li>
                {{ tagGroup.title }}
                <ul class="list list--nested list--nested--l2">
                    <li
                        v-for="tag of tagGroup.tags"
                        :key="tag.id"
                    >
                        <gnomic-fragments-link
                            :query="{ tag: tag.tag }"
                        >
                            {{ tag.tag }} ({{ tag.fragmentIds.length }})
                        </gnomic-fragments-link>
                    </li>
                </ul>
            </li>
        </ul>
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
                const tags = sortBy(state.tags, [
                    tag => tag.fragmentIds.length * -1,
                    tag => caseInsensitive(tag.tag),
                ]);
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
