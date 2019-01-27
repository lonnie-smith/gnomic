<template>
    <div>
        <div v-if="showDate">{{ date }}</div>
        <div v-if="showWork">{{ fragment.work.title }}</div>
        <div v-html="fragment.content" />
    </div>
</template>

<script>
export default {
    props: {
        fragment: {
            type: Object,
            required: true,
        },
        showWork: {
            type: Boolean,
            'default': true,
        },
        showTags: {
            type: Boolean,
            'default': true,
        },
    },
    computed: {
        date() {
            return (new Date(this.fragment.date))
                .toLocaleDateString();
        },
    },
}
</script>