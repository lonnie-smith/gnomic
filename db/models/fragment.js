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

    async _updateTags() {
        for (const tag of this.tags) {
            await tag.save();
        }
        await db('fragmentTags')
            .where({ fragmentId: this.id })
            .del();
        await db('fragmentTags')
            .insert(this.tags.map(tag => {
                return {
                    fragmentId: this.id,
                    tagId: tag.id,
                };
            }));
        await db('tags')
            .whereNotIn('id',
                db.select('tagId').from('fragmentTags'))
            .del();
    }

    async save() {
        return db.transaction(transaction => {
            return this.work.save(transaction)
                .then(() => {
                    return super.save({
                        slug: this.slug,
                    }, transaction);
                })
                .then(() => {
                    return transaction('works')
                        .whereNotIn('id',
                            transaction.select('workId').from('fragments'))
                        .del();
                })
                .then(() => {
                    return Promise.resolve();
                });
        });
    }
};
