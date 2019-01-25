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

    async _update() {
        await super._update();
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
        await this.work.save();
        await super.save({
            slug: this.slug,
        });
        await db('works')
            .whereNotIn('id',
                db.select('workId').from('fragments'))
            .del();
        await this._updateTags();
    }
};
