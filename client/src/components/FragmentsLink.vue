<template>
    <router-link :to="path">
        <slot />
    </router-link>
</template>

<script>
export default {
    props: {
        query: {
            type: Object,
            required: true,
        },
    },
    computed: {
        path() {
            let path = '/fragments?';
            Object.keys(this.query).forEach(key => {
                const value = this.query[key];
                path = path + (value
                    ? `${key}=${encodeURIComponent(this.query[key])}`
                    : '');
            })
            return path;
        },
    },
};
</script>