const lunr = require('lunr');

const Fragment = require('../models/fragment');

module.exports = class FullTextIndex {
    constructor() {
        this.builder = new lunr.Builder();
        this.builder.ref('id');
        this.builder.field('text');
        this._index = null;
        this.docCt = 0;
    }

    addFragment(plainText, fragmentId) {
        this.builder.add({
            text: plainText,
            id: fragmentId,
        });
        this.docCt++;
    }

    get index() {
        if (this._index) {
            return this._index;
        }
        this._index = this.builder.build();
        console.log('getting index; docCt', this.docCt)
        return this._index;
    }
};
