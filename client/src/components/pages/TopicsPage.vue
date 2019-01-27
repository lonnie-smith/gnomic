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
                    <span>{{ tag.tag }}</span>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { sortBy } from 'lodash';
import { store, mutations, actions } from '../../scripts/store';

const TAG_TYPE_MAP = {
    person: 'People',
    work: 'Titles',
    topic: 'Topics',
    period: 'Eras',
};

export default {
    store,
    computed: {
        ...mapState({
            tagGroups: state => {
                const groups = [];
                const dict = {};
                const tags = sortBy(state.tags, ['type', 'tag']);
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
