<template>
    <div class="blockQuote">
        <div
            ref="container"
            :class="{ isOpen: openByDefault || isOpen }"
            :style="{ maxHeight }"
            class="blockQuote__container"
            @click="open"
        >
            <blockquote
                ref="quote"
                class="blockQuote__container__content"
                v-html="contentHtml"
            />
        </div>
        <div
            v-show="!openByDefault && !isOpen"
            class="blockQuote__controls"
        >
            <button
                role="button"
                @click="open"
            >
                more
            </button>
        </div>
    </div>
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
            isMounted: false,
        };
    },
    computed: {
        maxHeight() {
            if (!this.isMounted) {
                return 'auto';
            }
            if (!(this.isOpen || this.openByDefault)) {
                return '250px';
            }
            return `${this.quoteHeight}px`;
        },
        quoteHeight() {
            if (!this.isMounted) {
                return 0;
            }
            return this.$refs.container.scrollHeight;
        },
        openByDefault() {
            if (this.quoteHeight === 0) {
                return false;
            }
            return this.quoteHeight < 400;
        },
    },
    mounted() {
        this.isMounted = true;
    },
    methods: {
        open() {
            this.isOpen = true;
        },
    },
};

</script>
