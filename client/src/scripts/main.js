import 'babel-polyfill';
import Vue from 'vue';
import '../components';

const root = document.getElementById('appRoot');
const app = new Vue({
    el: root,
});
