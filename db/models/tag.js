const BaseModel = require('./baseModel');
const db = require('../db');

module.exports = class Tag extends BaseModel {
    constructor({
        id = null,
        tag,
        type,
    }) {
        super();
        this._table = 'tags';
        this.id = id;
        this.tag = tag;
        this.type = type;
    }

    get _columns() {
        return {
            tag: this.tag,
            type: this.type,
        };
    }

    static _fromRows(rows) {
        return rows.map(row => new Tag(row));
    }

    static get query() {
        return db.from('tags')
            .select('tags.id',
                'tags.tag',
                'tags.type')
            .orderBy('tags.type');
    }

    static async list() {
        return Tag.query
            .then(rows => Tag._fromRows(rows));
    }

    async save(currentTransaction = null) {
        return super.save({
            tag: this.tag,
        }, currentTransaction);
    }
};
