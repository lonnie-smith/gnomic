const db = require('../db');
const { parseAuthor } = require('../util');
const BaseModel = require('./baseModel');
const Work = require('./work');
const Tag = require('./tag');

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

    /**
    * Returns an array of tag objects suitable for sending to front end.
    *
    * @static
    * @param {Array<any>} rows
    * @returns {Array<any>}
    */
    static _fromRows(rows) {
        // NB: collapses tag IDs into array
        const fragments = {};
        rows.forEach(row => {
            let fragment = fragments[row.id];
            if (!fragment) {
                fragment = {
                    id: row.id,
                    slug: row.slug,
                    date: new Date(row.date),
                    workId: row.workId,
                    tagIds: [],
                };
                fragments[row.id] = fragment;
            };
            fragment.tagIds.push(row.tagId);
        });
        return Object.values(fragments);
    }

    /**
    * Fetches an array of all fragments, formatted for return to front end.
    *
    * @static
    * @returns {Promise}
    */
    static async list() {
        return db.from('fragments')
            .innerJoin('works', 'fragments.workId', 'works.id')
            .innerJoin('fragmentTags', 'fragments.id', 'fragmentTags.fragmentId')
            .innerJoin('tags', 'fragmentTags.tagId', 'tags.id')
            .select('fragments.id as id',
                'slug',
                'date',
                'content',
                'works.id as workId',
                'works.authorLastName',
                'works.authorFirstName',
                'tags.id as tagId',
            )
            .then(rows => Fragment._fromRows(rows));
    }

    /**
     * Returns a single object like { id, content } suitable for return to front
     * end.
     *
     * @static
     * @param {number|string} slugOrId
     * @returns {Promise}
     */
    static async getOne(slugOrId) {
        const query = db.from('fragments')
            .select('id',
                'content',
            )
            .distinct();
        if (typeof(slugOrId) === 'number') {
            query.where('id', slugOrId);
        } else {
            query.where('slug', slugOrId);
        }
        return query.then(rows => {
            if (rows.length === 0) {
                return null;
            }
            return rows[0];
        });
    }

    /**
     * Returns array of objects like { id, content } suitable for return to
     * front end.
     *
     * @static
     * @param {Object} { ids = null, workId = null, authorFullName = null, tag = null }
     * @returns {Promise}
     */
    static async query({ ids = null, workId = null, authorFullName = null, tag = null }) {
        const query = db.from('fragments')
            .select('id', 'content');
        if (ids) {
            query.whereIn('id', ids);
        }
        if (workId) {
            query.where({ workId });
        }
        if (authorFullName) {
            const { last, first } = parseAuthor(authorFullName);
            query.innerJoin('works', 'works.id', 'fragments.workId')
                .where({
                    'works.authorLastName': last,
                    'works.authorFirstName': first,
                });
        }
        if (tag) {
            query.innerJoin('fragmentTags', 'fragmentTags.fragmentId', 'fragments.id')
                .innerJoin('tags', 'tags.id', 'fragmentTags.tagId')
                .where({ 'tags.tag': tag });
        }
        return query;
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
