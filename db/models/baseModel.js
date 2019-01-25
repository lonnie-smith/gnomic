const db = require('../db');

module.exports = class BaseModel {
    constructor() {
        this._table = 'abstract';
        this.id = null;
    }

    get _columns() {
        return {};
    }

    async _insert() {
        await db(this._table).insert(this._columns);
        const id = db(this._table).max('id');
        this.id = id;
    }

    async _update() {
        await db(this._table)
            .where({ id: this.id })
            .update(this._columns);
    }

    async save(queryForExistingRecord) {
        if (this.id) {
            return this._update();
        }

        const oldRecords = await db(this._table)
            .where(queryForExistingRecord)
            .distinct()
            .select('id');

        if (oldRecords.length > 0) {
            this.id = oldRecords[0].id;
            return this._update();
        } else {
            return this._insert();
        }
    }
}