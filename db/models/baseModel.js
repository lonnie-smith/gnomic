const db = require('../db');

module.exports = class BaseModel {
    constructor() {
        this._table = 'abstract';
        this.id = null;
    }

    get _columns() {
        return {};
    }

    async _insert(currentTransaction = null) {
        const knex = currentTransaction || db;
        return knex.insert(this._columns)
            .into(this._table)
            .then(() => knex(this._table).max('id as newId'))
            .then(rows => {
                this.id = rows[0].newId;
                console.log('set id for', this.constructor.name, this.id);
                return Promise.resolve();
            });
    }

    async _update(currentTransaction = null) {
        const knex = currentTransaction || db;
        return knex(this._table)
            .where({ id: this.id })
            .update(this._columns);
    }

    async save(queryForExistingRecord, currentTransaction = null) {
        const knex = currentTransaction || db;
        if (this.id) {
            return this._update(currentTransaction);
        }

        const oldRecords = await knex(this._table)
            .where(queryForExistingRecord)
            .distinct()
            .select('id');

        if (oldRecords.length > 0) {
            this.id = oldRecords[0].id;
            return this._update(currentTransaction);
        } else {
            return this._insert(currentTransaction);
        }
    }
};
