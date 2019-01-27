/* eslint-disable no-param-reassign */
export const types = {
    SET_FRAGMENTS: 'setFragments',
    SET_TAGS: 'setTags',
    SET_WORKS: 'setWorks',
};

export const mutations = {
    [types.SET_FRAGMENTS](state, fragmentsArray) {
        setWithOrder(state, fragmentsArray, 'fragments', 'fragmentOrder');
    },

    [types.SET_WORKS](state, worksArray) {
        setWithOrder(state, worksArray, 'works', 'workOrder');
    },

    [types.SET_TAGS](state, tagsArray) {
        setWithOrder(state, tagsArray, 'tags', 'tagOrder');
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
