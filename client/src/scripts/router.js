import VueRouter from 'vue-router';

import Chronology from '../components/pages/ChronologyPage.vue';
import Fragments from '../components/pages/FragmentsPage.vue';
import Timeline from '../components/Timeline.vue';
import Topics from '../components/pages/TopicsPage.vue';
import Works from '../components/pages/WorksPage.vue';
import WorkSorter from '../components/WorkSorter.vue';


const routes = [
    { path: '/', redirect: '/chronology' },
    {
        path: '/chronology',
        components: { main: Chronology, sidebar: Timeline },
    },
    {
        path: '/works',
        components: { main: Works, sidebar: WorkSorter },
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
            main: queryToProps,
            sidebar: queryToProps,
        },
    },
];

export const router = new VueRouter({
    routes,
    mode: 'hash',
    linkActiveClass: 'isActive',
});

function queryToProps(route) {
    return {
        ...route.query,
        workId: route.query.workId
            ? parseInt(route.query.workId, 10)
            : null,
    };
}
