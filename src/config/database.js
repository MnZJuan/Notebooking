const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'notebooking',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
});

pool.on('error', (err) => {
    console.error('Erro na conexão com o banco de dados:', err);
});

module.exports = pool;
