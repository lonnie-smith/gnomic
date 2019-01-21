exports.up = function(knex, Promise) {
    return knex.schema.hasTable('fragmentTags').then(exists => {
        if (!exists) {
            return knex.schema.createTable('fragmentTags', table => {
                table.integer('fragmentId').notNullable()
                    .references('fragments.id');
                table.integer('tagId').notNullable()
                    .references('tags.id');
            });
        }
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('fragmentTags');
};

