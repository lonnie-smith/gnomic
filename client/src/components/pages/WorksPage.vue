<template>
    <div>
        <ul>
            <li
                v-for="(works, index) of authorGroups"
                :key="index"
            >
                <gnomic-fragments-link
                    :query="{
                        author: `${works[0].authorLastName}, ${works[0].authorFirstName}`
                    }"
                >
                    <span>
                        {{ works[0].authorFirstName }}
                        {{ works[0].authorLastName }}
                    </span>
                </gnomic-fragments-link>

                <ul>
                    <li
                        v-for="work of works"
                        :key="work.id"
                    >
                        <gnomic-fragments-link
                            :query="{ work: work.id }"
                        >
                            <span>{{ work.title }}</span>
                            <span v-if="work.publicationYear">
                                ({{ work.publicationYear }})
                            </span>
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
import { store, mutations, actions } from '../../scripts/store';
import FragmentsLink from '../FragmentsLink.vue';

export default {
    store,
    components: {
        'gnomic-fragments-link': FragmentsLink,
    },
    computed: {
        ...mapState({
            authorGroups: state => {
                const groups = [];
                const dict = {};
                const works = sortBy(state.works, [
                    'authorLastName',
                    'authorFirstName',
                    'publicationYear',
                    'title',
                ]);
                works.forEach(work => {
                    const key = `${work.authorFirstName}${work.authorLastName}`;
                    const index = dict[key];
                    let group;
                    if (index != null) {
                        group = groups[index];
                    } else {
                        dict[key] = groups.length;
                        group = [];
                        groups.push(group);
                    }
                    group.push(work);
                });
                return groups;
            },
        }),
    },
};
</script>