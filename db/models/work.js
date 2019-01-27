const BaseModel = require('./baseModel');
const db = require('../db');

module.exports = class Work extends BaseModel {
    constructor({
        id = null,
        authorFirstName,
        authorLastName,
        publicationYear,
        title,
        url,
    }) {
        super();
        this._table = 'works';
        this.id = id;
        this.authorFirstName = authorFirstName;
        this.authorLastName = authorLastName;
        this.publicationYear = publicationYear;
        this.url = url;
        this.title = title;
    }

    get _columns() {
        return {
            authorFirstName: this.authorFirstName,
            authorLastName: this.authorLastName,
            publicationYear: this.publicationYear,
            title: this.title,
            url: this.url,
        };
    }

    static _fromRows(rows) {
        return rows.map(row => new Work(row));
    }

    static get query() {
        return db.from('works')
            // .leftJoin('fragments', 'works.id', 'fragments.workId')
            .select('works.id as workId',
                'works.authorLastName',
                'works.authorFirstName',
                'works.publicationYear',
                'works.title',
                'works.url',
            );
    }

    static async list() {
        return Work.query
            .then(rows => Work._fromRows(rows));
    }

    async save(currentTransaction = null) {
        return super.save({
            authorFirstName: this.authorFirstName,
            authorLastName: this.authorLastName,
            title: this.title,
        }, currentTransaction);
    }
};
