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

    /**
     * Returns an array of tag objects suitable for sending to front end.
     *
     * @static
     * @param {Array<any>} rows
     * @returns {Array<any>}
     */
    static _fromRows(rows) {
        // NB: collapses fragment IDs into array
        const tags = {};
        rows.forEach(row => {
            let tag = tags[row.id];
            if (!tag) {
                tag = {
                    id: row.id,
                    tag: row.tag,
                    type: row.type,
                    fragmentIds: [],
                };
                tags[row.id] = tag;
            }
            tag.fragmentIds.push(row.fragmentId);
        });
        return Object.values(tags);
    }

    /**
     * Fetches an array of all tags, formatted for return to front end.
     *
     * @static
     * @returns {Promise}
     */
    static async list() {
        return db.from('tags')
            .innerJoin('fragmentTags', 'tags.id', 'fragmentTags.tagId')
            .select('tags.id as id',
                'tag',
                'type',
                'fragmentTags.fragmentId as fragmentId')
            .then(rows => Tag._fromRows(rows));
    }

    async save(currentTransaction = null) {
        return super.save({
            tag: this.tag,
        }, currentTransaction);
    }
};
