/* eslint-disable no-param-reassign */
export const types = {
    SET_FRAGMENTS: 'setFragments',
    SET_WORKS: 'setWorks',
};

export const mutations = {
    [types.SET_FRAGMENTS](state, fragmentsArray) {
        setWithDict(state, fragmentsArray, 'fragments', 'fragmentsOrder');
    },

    [types.SET_WORKS](state, worksArray) {
        setWithDict(state, worksArray, 'works', 'worksOrder');
    },
};

function setWithDict(state, array, propertyName, orderName) {
    const order = [];
    const dict = {};
    array.forEach(item => {
        order.push(item.id);
        dict[item.id] = item;
    });
    state[propertyName] = dict;
    state[orderName] = order;
}
