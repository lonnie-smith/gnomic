const db = require('../db');

module.exports = class BaseModel {
    constructor() {
        this._table = 'abstract';
        this.id = null;
    }

    get _columns() {
        return {};
    }

    get api() {
        return cleanObject(JSON.parse(JSON.stringify(this)));

        function cleanObject(obj) {
            if (obj == null) {
                return obj;
            }
            if (typeof(obj) !== 'object') {
                return obj;
            } else if (Array.isArray(obj)) {
                return obj.map(item => cleanObject(item));
            } else {
                const cleaned = {};
                Object.getOwnPropertyNames(obj).forEach(key => {
                    if (key.indexOf('_') !== 0) {
                        const value = cleanObject(obj[key]);
                        if (value != null) {
                            cleaned[key] = value;
                        }
                    }
                });
                return cleaned;
            }
        }
    }

    async _insert(currentTransaction = null) {
        const knex = currentTransaction || db;
        return knex.insert(this._columns)
            .into(this._table)
            .then(() => knex(this._table).max('id as newId'))
            .then(rows => {
                this.id = rows[0].newId;
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
