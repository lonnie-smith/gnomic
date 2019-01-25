const BaseModel = require('./baseModel');
const db = require('../db');

module.exports = class Work extends BaseModel {
    constructor({
        authorFirstName,
        authorLastName,
        publicationYear,
        title,
        url,
    }) {
        super();
        this._table = 'works';
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

    async save() {
        return super.save({
            authorFirstName: this.authorFirstName,
            authorLastName: this.authorLastName,
            title: this.title,
        });
    }
};
