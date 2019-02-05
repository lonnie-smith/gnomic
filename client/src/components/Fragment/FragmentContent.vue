<script>
import Vue from 'vue';
import Accordion from './Accordion.vue';

export default {
    props: {
        contentHtml: {
            type: String,
            required: true,
        },
    },
    render(createElement) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.contentHtml, 'text/html');
        const sections = Array.from(doc.querySelectorAll('section'));
        const children = sections.map(section => {
            if (section.hasAttribute('data-accordion')) {
                const headerHtml = section.querySelector('[data-accordion-header]')
                    .innerHTML;
                const bodyHtml = Array.from(section.children)
                    .filter(node => !(node.hasAttribute('data-accordion-header')))
                    .map(node => node.outerHTML)
                    .join('');
                return createElement(Accordion, { props: { headerHtml, bodyHtml } });
            } else {
                // return createElement(Accordion, { props: { bodyHtml: section.innerHTML } });
                return Vue.compile(section.outerHTML);
            }
        });
        return createElement('section', {}, children);
    },
};
</script>
