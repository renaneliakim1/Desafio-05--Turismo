const { Pool } = require('pg');

const connectionString = 'postgres://avnadmin:AVNS_tswV_5idt54dxgbDiib@desafio-v-desafiov.i.aivencloud.com:28847/defaultdb?';

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  }
});

module.exports = pool;
