<template>
    <section
        :class="{ isOpen: true }"
        class="accordion"
        @click="toggle"
    >
        <h3
            v-if="headerHtml"
            class="accordion__header"
            v-html="headerHtml"
        />
        <div
            class="accordion__body"
            v-html="bodyHtml"
        />
    </section>
</template>

<script>

export default {
    props: {
        headerHtml: {
            type: String,
            required: false,
            'default': null,
        },
        bodyHtml: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            isOpen: false,
        };
    },
    methods: {
        toggle() {
            this.isOpen = !this.isOpen;
        },
    },
};

</script>
