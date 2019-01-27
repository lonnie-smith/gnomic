import Vue from 'vue';
import Vuex from 'vuex';
import { cloneDeep } from 'lodash';

import { defaultState } from './defaultState';
import { mutations as mutationFunctions, types as mutationTypes } from './mutations';
import { actions as actionFunctions, types as actionTypes } from './actions';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: cloneDeep(defaultState),
    mutations: mutationFunctions,
    actions: actionFunctions,
});

export const actions = actionTypes;
export const mutations = mutationTypes;
