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
                            :query="{ workId: parseInt(work.id, 10) }"
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
import { surname, caseInsensitive, yearString, title } from '../../scripts/util/sortComparators';
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
                    work => surname(work.authorLastName),
                    work => caseInsensitive(work.authorFirstName),
                    work => yearString(work.publicationYear),
                    work => title(work.title),
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
