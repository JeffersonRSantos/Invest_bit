require('dotenv').config()

const ConfigKnex: object = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    },
    migrations: {
        tableName: 'knex_migrations',
        extension: 'ts',
        directory: 'src/services/Database/migrations'
    },
    seeds: {
        directory: './src/services/Database/seeds'
    },
    pool: { min: 0, max: 100 },
    useNullAsDefault: true,
    debug: false
};

export default ConfigKnex;