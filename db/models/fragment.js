const db = require('../db');
const BaseModel = require('./baseModel');

module.exports = class Fragment extends BaseModel {
    constructor({
        slug,
        date,
        content,
        work,
        tags,
    }) {
        super();
        this._table = 'fragments';
        this.slug = slug;
        this.date = date;
        this.content = content;
        this.work = work;
        this.tags = tags;
    }

    get _columns() {
        return {
            slug: this.slug,
            date: this.date,
            content: this.content,
            workId: this.work.id,
        };
    }

    async _updateTags(currentTransaction = null) {
        const knex = currentTransaction || db;
        for (const tag of this.tags) {
            await tag.save(currentTransaction);
        }
        await knex('fragmentTags')
            .where({ fragmentId: this.id })
            .del();
        await knex('fragmentTags')
            .insert(this.tags.map(tag => {
                return {
                    fragmentId: this.id,
                    tagId: tag.id,
                };
            }));
        return await Fragment.purgeTags(currentTransaction);
    }

    async save() {
        return db.transaction(transaction => {
            return this.work.save(transaction)
                .then(() => {
                    return super.save({
                        slug: this.slug,
                    }, transaction);
                })
                .then(() => Fragment.purgeWorks(transaction))
                .then(() => this._updateTags(transaction));
        });
    }

    static async purgeWorks(currentTransaction = null) {
        const knex = currentTransaction || db;
        return knex('works')
            .whereNotIn('id', knex.select('workId').from('fragments'))
            .del();
    }

    static async purgeTags(currentTransaction = null) {
        const knex = currentTransaction || db;
        return knex('fragmentTags')
            .whereNotIn('fragmentId', knex.select('id').from('fragments'))
            .del()
            .then(() => {
                return knex('tags')
                    .whereNotIn('id',
                        knex.select('tagId').from('fragmentTags'))
                    .del();
            });
    }
};
