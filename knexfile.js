require('env-merger')();

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: process.env.SQLITE_FILE,
            // filename: './devDb.sqlite3',
        },
        useNullAsDefault: true,
        migrations: {
            directory: process.env.MIGRATIONS_DIR,
            // directory: './db/migrations',
        },
        // debug: true,
    },

    // staging: {
    //   client: 'postgresql',
    //   connection: {
    //     database: 'my_db',
    //     user:     'username',
    //     password: 'password'
    //   },
    //   pool: {
    //     min: 2,
    //     max: 10
    //   },
    //   migrations: {
    //     tableName: 'knex_migrations'
    //   }
    // },

    // production: {
    //   client: 'postgresql',
    //   connection: {
    //     database: 'my_db',
    //     user:     'username',
    //     password: 'password'
    //   },
    //   pool: {
    //     min: 2,
    //     max: 10
    //   },
    //   migrations: {
    //     tableName: 'knex_migrations'
    //   }
    // }

};
