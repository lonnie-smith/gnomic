// TODO: can we require knex directly instead of passing down?
 
module.exports = class Work {
    constructor(knex, {
        id,
        authorFirstName,
        authorLastName,
        publicationYear,
        title,
    }) {
        this._table = 'works';
        this._knex = knex;
        this.id = id;
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
        return this.knex(this._table).insert({
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
        // TODO
    }

}