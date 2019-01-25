// TODO: can we require knex directly instead of passing down?
const db = require('../db');

module.exports = class Work {
    constructor({
        authorFirstName,
        authorLastName,
        publicationYear,
        title,
    }) {
        this._table = 'works';
        this.id = null;
        this.authorFirstName = authorFirstName;
        this.authorLastName = authorLastName;
        this.publicationYear = publicationYear;
        this.title = title;
    }

    // async static get(data) {
    //     if (data.id) {
    //         return knex(this._table).where({
    //             id: data.id,
    //         });
    //     }

    //     await knex(this._table).where({
    //         authorFirstName: data.authorFirstName,
    //         authorLastName: data.authorLastName,
    //         title: data.title,
    //     })
    //     .select('*');
    //     // TODO
    // }

    async insert() {
        // todo: move this to superclass
        return db(this._table).insert({
            authorLastName: this.authorLastName,
            authorFirstName: this.authorFirstName,
            title: this.title,
            publicationYear: this.publicationYear,
        });
    }

    async update() {
        // TODO
    }

    async insertOrUpdate() {
        return db(this._table)
            .where({
                authorFirstName: 'foo',
                authorLastName: 'foo',
                title: 'foo',
                // authorFirstName: this.authorFirstName,
                // authorLastName: this.authorLastName,
                // title: this.title,
            })
            .distinct()
            .select('id')
            .then(rslt => {
                console.log(rslt);
                return rslt;
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                // db.destroy();
            });
    }
};
