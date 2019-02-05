<template>
    <blockquote
        :class="{ isOpen: isOpen }"
        class="blockQuote"
        @click="open"
        v-html="contentHtml"
    />
</template>

<script>

export default {
    props: {
        contentHtml: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            isOpen: false,
        };
    },
    created() {
        if (this.contentHtml.length < 750) {
            this.isOpen = true;
        }
    },
    methods: {
        open() {
            this.isOpen = true;
        },
    },
};

</script>
