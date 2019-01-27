/* eslint-disable no-param-reassign */
export const types = {
    SET_FRAGMENTS: 'setFragments',
    SET_WORKS: 'setWorks',
};

export const mutations = {
    [types.SET_FRAGMENTS](state, fragmentsArray) {
        setWithOrder(state, fragmentsArray, 'fragments', 'fragmentOrder');
    },

    [types.SET_WORKS](state, worksArray) {
        setWithOrder(state, worksArray, 'works', 'workOrder');
    },
};

function setWithOrder(state, array, propertyName, orderName) {
    const order = [];
    const dict = {};
    array.forEach(item => {
        order.push(item.id);
        dict[item.id] = item;
    });
    state[propertyName] = dict;
    state[orderName] = order;
}
