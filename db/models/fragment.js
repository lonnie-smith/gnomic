const db = require('../db');
const BaseModel = require('./baseModel');
const Work = require('./work');

module.exports = class Fragment extends BaseModel {
    constructor({
        id = null,
        slug,
        date,
        content,
        work,
        tags,
    }) {
        super();
        this._table = 'fragments';
        this.id = id;
        this.slug = slug;
        this.date = typeof(date) === 'number'
            ? new Date(date)
            : date;
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

    static async list() {
        return db.from('fragments')
            .innerJoin('works', 'fragments.workId', 'works.id')
            .select('fragments.id as fragmentId',
            'fragments.slug',
            'fragments.date',
            'works.id as workId',
            'works.authorLastName',
            'works.authorFirstName',
            'works.title',
            'works.url',
            'works.publicationYear'
            )
            .then(rows => {
                return rows.map(row => {
                    const work = new Work({
                        id: row.workId,
                        authorLastName: row.authorLastName,
                        authorFirstName: row.authorFirstName,
                        title: row.title,
                        url: row.url,
                        publicationYear: row.publicationYear,
                    });
                    return new Fragment({
                        id: row.fragmentId,
                        slug: row.slug,
                        date: row.date,
                        content: null,
                        work,
                        tags: [],
                    });
                });
            });
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
