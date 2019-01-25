const BaseModel = require('./baseModel');
const db = require('../db');

module.exports = class Tag extends BaseModel {
    constructor({
        tag,
        type,
    }) {
        super();
        this._table = 'tags';
        this.tag = tag;
        this.type = type;
    }

    get _columns() {
        return {
            tag: this.tag,
            type: this.type,
        };
    }

    async save(currentTransaction = null) {
        return super.save({
            tag: this.tag,
        }, currentTransaction);
    }
};
