exports.up = function(knex, Promise) {
    return knex.schema.hasTable('fragmentTags').then(exists => {
        if (!exists) {
            return knex.schema.createTable('fragmentTags', table => {
                table.integer('fragmentId').notNullable()
                    .references('fragments.id')
                    .onDelete('CASCADE');
                table.integer('tagId').notNullable()
                    .references('tags.id')
                    .onDelete('CASCADE');
            });
        }
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('fragmentTags');
};

