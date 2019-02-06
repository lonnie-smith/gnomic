<template>
    <div>
        <div>
            <h2>By</h2>
            <label>
                <input
                    type="radio"
                    name="workSorterKey"
                />
                Author
            </label>
            <label>
                <input
                    type="radio"
                    name="workSorterKey"
                />
                Year
            </label>
        </div>
        <div>
            <h2>Order</h2>
            <label>
                <input
                    type="radio"
                    name="workSorterOrder"
                />
                Ascending
            </label>
            <label>
                <input
                    type="radio"
                    name="workSorterOrder"
                />
                Descending
            </label>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import { store, mutations } from '../scripts/store';

export default {
    store,
    computed: {
        ...mapState({
            sortKey: state => state.worksSort.key,
            sortDirection: state => state.worksSort.direction,
        }),
    },
    methods: {
        ...mapMutations({
            setWorksSort: mutations.SET_WORKS_SORT,
        }),
    },
};
</script>