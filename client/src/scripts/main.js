import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';

import '../components';

Vue.use(VueRouter);

const root = document.getElementById('appRoot');
const app = new Vue({
    el: root,
});
