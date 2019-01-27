<template>
    <div>
        <div>{{ date }}</div>
        <div>{{ fragment.work.title }}</div>
    </div>
</template>

<script>
export default {
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
    },
}
</script>