import VueRouter from 'vue-router';

import Chronology from '../components/pages/ChronologyPage.vue';
import Works from '../components/pages/WorksPage.vue';
import Topics from '../components/pages/TopicsPage.vue';
import Fragments from '../components/pages/FragmentsPage.vue';
import Timeline from '../components/Timeline.vue';

const routes = [
    { path: '/', redirect: '/chronology' },
    {
        path: '/chronology',
        components: { main: Chronology, sidebar: Timeline },
    },
    {
        path: '/works',
        components: { main: Works },
    },
    {
        path: '/topics',
        components: { main: Topics },
    },
    {
        path: '/fragment/:slug',
        components: { main: Fragments },
        props: true,
    },
    {
        path: '/fragments',
        components: { main: Fragments, sidebar: Timeline },
        props: {
            main: route => {
                return {
                    ...route.query,
                    workId: route.query.workId
                        ? parseInt(route.query.workId, 10)
                        : null,
                };
            },
            sidebar: false,
        },
    },
];

export const router = new VueRouter({
    routes,
    mode: 'hash',
    linkActiveClass: 'isActive',
});
