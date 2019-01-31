<template>
    <div>
        <div class="fragment__header">
            <h2 class="fragment__header__title">
                {{ title.title }}
                <div
                    v-if="title.subtitle"
                    class="fragment__header__title__subtitle"
                >
                    {{ title.subtitle }}
                </div>
            </h2>
            <div class="fragment__header__byline">
                <div class="stereo">
                    <div>
                        <gnomic-fragments-link
                            :query="{
                                author: `${fragments[0].work.authorLastName}, `
                                    + `${fragments[0].work.authorFirstName}`
                            }"
                            class="link--light"
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
            v-for="fragment of fragments"
            :key="fragment.id"
            class="fragment__fragmentList"
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
        title() {
            const title = this.fragments[0].work.title;
            const titleParts = title.split(/[:]\s+/);
            if (titleParts.length > 1) {
                return { title: `${titleParts[0]}:`, subtitle: titleParts[1] };
            }
            return { title };
        },
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
                return `${(new Date(min)).toLocaleDateString()}`
                    + '–'
                    + `${(new Date(max)).toLocaleDateString()}`;
            }
        },
    },
};
</script>
