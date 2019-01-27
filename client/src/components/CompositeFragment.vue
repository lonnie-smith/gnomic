<template>
    <div>
        <h2>
            <gnomic-fragments-link
                :query="{
                    author: `${fragments[0].work.authorLastName}, ${fragments[0].work.authorFirstName}`
                }"
            >
                <span>
                    {{ fragments[0].work.authorFirstName }}
                    {{ fragments[0].work.authorLastName }}
                </span>
            </gnomic-fragments-link>
            <span>
                {{ fragments[0].work.title }}
                <span v-if="fragments[0].work.publicationYear">
                    ({{ fragments[0].work.publicationYear }})
                </span>
            </span>
        </h2>
        <div>{{ dates }}</div>
        <div
            v-for="fragment of fragments"
            :key="fragment.id"
        >
            <gnomic-fragment
                :fragment="fragment"
            />
            <hr />
        </div>
    </div>
</template>

<script>
import Fragment from './Fragment.vue';
import FragmentsLink from './FragmentsLink.vue';

export default {
    components: {
        'gnomic-fragment': Fragment,
        'gnomic-fragments-link': FragmentsLink,
    },
    props: {
        fragments: {
            type: Array,
            required: true,
        },
    },
    computed: {
        dates() {
            let min = Infinity;
            let max = -1 * Infinity;
            this.fragments.forEach(fragment => {
                const date = new Date(fragment.date).valueOf();
                min = Math.min(min, date);
                max = Math.max(min, date);
            });
            if (min === max) {
                return (new Date(min)).toLocaleDateString();
            } else {
                return (new Date(min)).toLocaleDateString()
                    + '–'
                    + (new Date(max)).toLocaleDateString();
            }
        }
    }
};
</script>