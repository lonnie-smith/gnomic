<template>
    <div
        ref="timelineContainer"
        class="timeline"
    >
        <div
            :style="{
                transform: `translateY(${pipPosition}px)`,
                display: pipPosition < 0 ? 'none' : 'block',
            }"
            class="timeline__indicator"
        />
        <div class="timeline__wrapper">
            <div
                v-for="yearGroup of filteredWorkGroups"
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
                            class="timeline__yearGroup__monthGroup__list__item"
                            role="button"
                            @click="requestScroll($event, work.id)"
                        >
                            <span>{{ work.authorLastName }}</span>
                            <div
                                :ref="`pip_${work.id}`"
                                class="timeline__yearGroup__monthGroup__list__item__pip"
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { sortBy, groupBy, flatMap } from 'lodash';
import { store } from '../scripts/store';
import { filterFragments } from '../scripts/util/filterFragments';

export default {
    store,
    props: {
        slug: {
            type: String,
            'default': null,
        },
        tag: {
            type: String,
            'default': null,
        },
        author: {
            type: String, // last, first
            'default': null,
        },
        workId: {
            type: Number,
            'default': null,
        },
        ids: {
            type: Array,
            'default': () => [],
        },
    },
    data() {
        return {
            filteredWorkGroups: [],
        };
    },
    computed: {
        ...mapState({
            works: state => state.works,
            tags: state => state.tags,
            fragments: state => state.fragments,
            pipPosition(state) {
                const workId = state.itemInViewport;
                const pips = this.$refs[`pip_${workId}`];
                if (pips && pips[0]) {
                    const pipTop = pips[0]
                        .getBoundingClientRect()
                        .top;
                    const containerTop = this.$refs
                        .timelineContainer
                        .getBoundingClientRect()
                        .top;
                    const scrollDist = this.$refs
                        .timelineContainer
                        .scrollTop;
                    return pipTop - containerTop + scrollDist;
                }
                return -1000;
            },
        }),
    },
    watch: {
        slug() {
            this.setFilteredWorkGroups();
        },
        tag() {
            this.setFilteredWorkGroups();
        },
        author() {
            this.setFilteredWorkGroups();
        },
        workId() {
            this.setFilteredWorkGroups();
        },
        ids() {
            this.setFilteredWorkGroups();
        },
    },
    mounted() {
        this.setFilteredWorkGroups();
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
        getFilteredWorks() {
            if (!(this.slug || this.tag || this.author || this.workId || this.ids.length > 0)) {
                return this.works;
            }
            const fragments = filterFragments({
                fragments: this.fragments,
                works: this.works,
                tags: this.tags,
                slug: this.slug,
                authorName: this.authorName,
                workId: this.workId,
                tag: this.tag,
                ids: this.ids,
            });
            const works = {};
            Object.values(fragments).forEach(fragment => {
                works[fragment.workId] = this.works[fragment.workId];
            });
            return works;
        },
        setFilteredWorkGroups() {
            let grouped = groupBy(
                Object.values(this.getFilteredWorks()),
                work => {
                    return work.date.getFullYear();
                });
            grouped = flatMap(grouped, (workArray, year) => {
                return {
                    year,
                    months: groupByMonths(workArray),
                };
            });
            grouped = sortBy(grouped, ['year']).reverse();
            this.filteredWorkGroups = grouped;

            function groupByMonths(works) {
                let grouped = groupBy(works, work => work.date.getMonth());
                grouped = flatMap(grouped, (workArray, month) => {
                    return {
                        month: parseInt(month, 10),
                        works: sortBy(workArray, ['date', 'id']).reverse(),
                    };
                });
                grouped = sortBy(grouped, ['month']).reverse();
                return grouped;
            }
        },
    },
};

</script>
