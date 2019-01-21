
exports.up = function(knex, Promise) {
    return knex.schema.hasTable('fragments').then(exists => {
        if (!exists) {
            return knex.schema.createTable('fragments', table => {
                table.increments('id').primary();
                table.string('slug').notNullable()
                    .unique();
                table.integer('workId').notNullable()
                    .references('works.id');
                table.date('date').notNullable();
                table.text('content', 'longtext').notNullable();
            });
        }
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('fragments');
};
