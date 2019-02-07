<script>
import Vue from 'vue';
import BlockQuote from './BlockQuote.vue';

export default {
    props: {
        contentHtml: {
            type: String,
            'default': '',
        },
    },
    render(createElement) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.contentHtml, 'text/html');
        const sections = Array.from(doc.querySelectorAll('section'))
            .map(section => {
                const sectionChildren = Array.from(section.children).map(child => {
                    if (child.tagName === 'BLOCKQUOTE') {
                        const contentHtml = child.innerHTML;
                        return createElement(BlockQuote, { props: { contentHtml } });
                    } else {
                        return createElement(child.tagName,
                            { domProps: { innerHTML: child.innerHTML } });
                    }
                });
                return createElement('section', {}, sectionChildren);
            });
        return createElement('article', {}, sections);
    },
};
</script>
