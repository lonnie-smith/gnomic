
exports.up = function(knex, Promise) {
    return knex.schema.hasTable('tags').then(exists => {
        if (!exists) {
            return knex.schema.createTable('tags', table => {
                table.increments('id').primary();
                table.string('tag').unique()
                    .notNullable();
                table.enu('type', [
                    'person',
                    'work',
                    'topic',
                    'period',
                ])
                .defaultTo('topic');
            });
        }
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tags');
};
