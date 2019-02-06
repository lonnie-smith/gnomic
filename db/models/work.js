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

    /**
     * Returns an array of fragment objects suitable for sending to front end.
     *
     * @static
     * @param {Array<any>} rows
     * @returns {Array<any>}
     */
    static _fromRows(rows) {
        // NB: we collapse fragmentIds from multiple rows into an array fragmentIds
        // We also find the latest fragment date and store it as work.date.
        const works = {};
        rows.forEach(row => {
            let work = works[row.id];
            if (!work) {
                work = {
                    id: row.id,
                    authorFirstName: row.authorFirstName,
                    authorLastName: row.authorLastName,
                    publicationYear: row.publicationYear,
                    title: row.title,
                    url: row.url,
                    fragmentIds: [],
                };
                works[row.id] = work;
                const newDate = new Date(row.date);
                work.date = !work.date || newDate > work.date ? newDate : work.date;
            }
            work.fragmentIds.push(row.fragmentId);
        });
        return Object.values(works);
    }

    /**
     * Fetches a dict of all works, formatted for return to front end.
     * Keys are work IDs.
     *
     * @static
     * @returns {Promise}
     */
    static async list() {
        return db.from('works')
            .innerJoin('fragments', 'works.id', 'fragments.workId')
            .select('works.id as id',
                'authorLastName',
                'authorFirstName',
                'publicationYear',
                'title',
                'url',
                'fragments.id as fragmentId',
                'fragments.date as date'
            )
            .then(rows => Work._fromRows(rows));
    }

    async save(currentTransaction = null) {
        const query = {
            authorLastName: this.authorLastName,
            title: this.title,
        };
        if (this.authorFirstName) {
            query.authorFirstName = this.authorFirstName;
        }
        return super.save(query, currentTransaction);
    }
};
