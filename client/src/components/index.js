import Vue from 'vue';
import AppContainer from './AppContainer/AppContainer.vue';

const components = {
    'gnomic-app-container': AppContainer,
};


// register all global components
Object.keys(components).forEach(key => {
    Vue.component(key, components[key]);
});
