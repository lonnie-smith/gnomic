<template>
    <div>
        <div class="fragment__header">
            <h2 class="fragment__header__title">
                <span class="fragment__header__title">
                    {{ fragments[0].work.title }}
                </span>
            </h2>
            <div class="fragment__header__byline">
                <div class="stereo">
                    <div>
                        <gnomic-fragments-link
                            class="link--light"
                            :query="{
                                author: `${fragments[0].work.authorLastName}, ${fragments[0].work.authorFirstName}`
                            }"
                        >
                            <span>
                                {{ fragments[0].work.authorFirstName }}
                                {{ fragments[0].work.authorLastName }}
                            </span>
                        </gnomic-fragments-link>
                        <span
                            v-if="fragments[0].work.publicationYear"
                            class="fragment__header__byline__year"
                        >
                            ({{ fragments[0].work.publicationYear }})
                        </span>
                    </div>
                    <div>{{ dates }}</div>
                </div>
            </div>
        </div>
        <div
            class="fragment__fragmentList"
            v-for="fragment of fragments"
            :key="fragment.id"
        >
            <gnomic-fragment
                :fragment="fragment"
            />
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
