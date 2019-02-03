<template>
    <div class="timeline">
        <div
            v-for="yearGroup of groupedWorks"
            :key="yearGroup.year"
            class="timeline__yearGroup"
        >
            <h2 class="timeline__yearGroup__title">
                {{ yearGroup.year }}
            </h2>
            <div
                v-for="monthGroup of yearGroup.months"
                :key="monthGroup.month"
                class="timeline__yearGroup__monthGroup"
            >
                <h3 class="timeline__yearGroup__monthGroup__title">
                    {{ intToMonth(monthGroup.month) }}
                </h3>
                <ul
                    class="timeline__yearGroup__monthGroup__list"
                >
                    <li
                        v-for="work of monthGroup.works"
                        :key="work.id"
                        :class="{ isActive: parseInt(work.id) === parseInt(activeWorkId) }"
                        class="timeline__yearGroup__monthGroup__list__item"
                        role="button"
                        @click="requestScroll($event, work.id)"
                    >
                        <span>{{ workDisplay(work) }}</span>
                        <div class="timeline__yearGroup__monthGroup__list__item__pip" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { sortBy, groupBy, flatMap } from 'lodash';
import { store } from '../scripts/store';

export default {
    store,
    computed: {
        ...mapState({
            groupedWorks: state => {
                let grouped = groupBy(
                    Object.values(state.works),
                    work => {
                    return work.date.getFullYear();
                });
                grouped = flatMap(grouped, (workArray, year) => {
                    return {
                        year,
                        months: groupByMonths(workArray),
                    }
                });
                grouped = sortBy(grouped, ['year']).reverse();
                return grouped;

                function groupByMonths(works) {
                    let grouped = groupBy(works, work => work.date.getMonth());
                    grouped = flatMap(grouped, (workArray, month) => {
                        return {
                            month: parseInt(month, 10),
                            works: sortBy(workArray, ['date', 'title']).reverse(),
                        };
                    });
                    grouped = sortBy(grouped, ['month']).reverse();
                    return grouped;
                }
            },
            activeWorkId: state => {
                console.log(state.workIdInViewport);
                return state.workIdInViewport;
            },
        }),
    },
    methods: {
        intToMonth(int) {
            return {
                0: 'January',
                1: 'February',
                2: 'March',
                3: 'April',
                4: 'May',
                5: 'June',
                6: 'July',
                7: 'August',
                8: 'September',
                9: 'October',
                10: 'November',
                11: 'December',
            }[int];
        },
        requestScroll(event, workId) {
            const toEmit = new CustomEvent('gnomic-request-scroll', {
                bubbles: true,
                detail: { workId },
            });
            event.target.dispatchEvent(toEmit);
        },
        workDisplay(work) {
            const initials = work.authorFirstName.length > 0
                ? work.authorFirstName.split(/\.|\s+/g)
                    .map(word => word.slice(0, 1))
                    .filter(letter => letter === letter.toUpperCase())
                    .concat('')
                    .join('.') + ' '
                : '';
            return `${initials}${work.authorLastName}`;
        },
    },
}

</script>