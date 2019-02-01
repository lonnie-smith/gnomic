<template>
    <div
        v-show="isLoading"
        class="loadingIndicator"
    >
        <div class="loadingIndicator__dots">
            <span
                v-for="(isActive, index) of dots"
                :key="index"
                :class="{
                    isActive: isActive,
                }"
                class="loadingIndicator__dots__dot"
            />
        </div>
    </div>
</template>

<script>

export default {
    props: {
        isLoading: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            dots: [false, false, false],
            nextDot: 0,
            interval: null,
        };
    },
    watch: {
        isLoading(newVal) {
            this.setTicking(newVal);
        },
    },
    mounted() {
        this.setTicking(this.isLoading);
    },
    methods: {
        setTicking(state) {
            if (state) {
                this.dots = [false, false, false];
                this.nextDot = 0;
                this.interval = setInterval(() => this.tick(), 500);
            } else {
                clearInterval(this.interval);
            }
        },
        tick() {
            if (!this.isLoading) {
                clearInterval(this.interval);
            } else {
                if (this.nextDot >= this.dots.length) {
                    this.dots = [false, false, false];
                    this.nextDot = 0;
                } else {
                    const dots = [...this.dots];
                    dots[this.nextDot] = true;
                    this.dots = dots;
                    this.nextDot++;
                }
                console.log(this.dots);
            }
        },
    },
};

</script>
