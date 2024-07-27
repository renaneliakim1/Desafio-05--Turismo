const { Pool } = require('pg');

const connectionString = 'postgres://avnadmin:AVNS_tswV_5idt54dxgbDiib@desafio-v-desafiov.i.aivencloud.com:28847/defaultdb';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to the database');
  release();
});

module.exports = pool;
