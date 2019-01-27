<template>
    <div class="fragment">
        <div
            class="fragment__content"
            v-html="fragment.content"
        />
        <ul class="fragment__tags">
            <li
                v-for="tag of tags"
                :key="tag.id"
            >
                <gnomic-fragments-link
                    :query="{ tag: tag.tag }"
                >
                    {{ tag.tag }}
                </gnomic-fragments-link>
            </li>
        </ul>
    </div>
</template>

<script>
import FragmentsLink from './FragmentsLink.vue';

export default {
    components: {
        'gnomic-fragments-link': FragmentsLink,
    },
    props: {
        fragment: {
            type: Object,
            required: true,
        },
    },
    computed: {
        date() {
            return (new Date(this.fragment.date))
                .toLocaleDateString();
        },
        tags() {
            const author = `${this.fragment.work.authorFirstName}`
                + ` ${this.fragment.work.authorLastName}`;
            return this.fragment.tags.filter(tag => {
                if (tag.tag === author
                    || tag.tag === this.fragment.work.title) {
                    return false;
                }
                return true;
            });
        },
    },
};
</script>
