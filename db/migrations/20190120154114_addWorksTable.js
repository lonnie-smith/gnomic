exports.up = function(knex, Promise) {
    return knex.schema.hasTable('works').then(exists => {
        if (!exists) {
            return knex.schema.createTable('works', table => {
                table.increments('id').primary();
                table.string('authorLastName').notNullable();
                table.string('authorFirstName').notNullable();
                table.string('title').notNullable();
                table.string('url');
                table.string('publicationYear');
            })
            .then(() => {
                return knex.schema.alterTable('works', table => {
                    table.unique([
                        'authorLastName',
                        'authorFirstName',
                        'title',
                    ]);
                });
            });
        };
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('works');
};
