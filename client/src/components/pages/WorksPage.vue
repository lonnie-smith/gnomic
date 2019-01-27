<template>
    <div>
        <ul>
            <li
                v-for="(works, index) of authorGroups"
                :key="index"
            >
                <span>
                    {{ works[0].authorFirstName }}
                    {{ works[0].authorLastName }}
                </span>
                <ul>
                    <li
                        v-for="work of works"
                        :key="work.id"
                    >
                        <span>{{ work.title }}</span>
                        <span v-if="work.publicationYear">
                            ({{ work.publicationYear }})
                        </span>
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

export default {
    store,
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