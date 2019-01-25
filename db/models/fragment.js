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

    static _fromRows(rows) {
        const fragmentDict = {};
        const fragments = [];
        rows.forEach(row => {
            const fragmentIndex = fragmentDict[row.fragmentId];
            let fragment;
            if (!isNaN(fragmentIndex)) {
                fragment = fragments[fragmentIndex];
            } else {
                const work = new Work({
                    id: row.workId,
                    authorLastName: row.authorLastName,
                    authorFirstName: row.authorFirstName,
                    title: row.title,
                    url: row.url,
                    publicationYear: row.publicationYear,
                });
                fragment = new Fragment({
                    id: row.fragmentId,
                    slug: row.slug,
                    date: row.date,
                    content: row.content,
                    work,
                    tags: [],
                });
                fragments.push(fragment);
                fragmentDict[row.fragmentId] = fragments.length - 1;
            };
            fragment.tags.push(new Tag({
                id: row.tagId,
                tag: row.tag,
                type: row.type,
            }));
        });
        return fragments;
    }

    static get _query() {
        return db.from('fragments')
            .innerJoin('works', 'fragments.workId', 'works.id')
            .innerJoin('fragmentTags', 'fragments.id', 'fragmentTags.fragmentId')
            .innerJoin('tags', 'fragmentTags.tagId', 'tags.id')
            .select('fragments.id as fragmentId',
                'fragments.slug',
                'fragments.date',
                'fragments.content',
                'works.id as workId',
                'works.authorLastName',
                'works.authorFirstName',
                'works.title',
                'works.url',
                'works.publicationYear',
                'tags.id as tagId',
                'tag',
                'type',
            );
    }

    static async list({
        work = null,
        authorFullName = null,
        tag = null,
    }) {
        const query = Fragment._query
            .orderBy('date', 'desc');
        if (work) {
            query.where({ workId: parseInt(work, 10) });
        }
        if (authorFullName) {
            const author = parseAuthor(authorFullName);
            query.where({
                authorLastName: author.last,
                authorFirstName: author.first,
            });
        }
        if (tag) {
            query.where({
                tag,
            });
        }
        return query
            .then(rows => Fragment._fromRows(rows));
    }

    static async find(slug) {
        return Fragment._query
            .where({
                'fragments.slug': slug,
            })
            .distinct()
            .then(rows => {
                if (rows.length === 0) {
                    return null;
                }
                return Fragment._fromRows(rows)[0];
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
