const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DB;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false 
  }
});

pool.connect()
  .then(client => {
    console.log('Connected to the database');
    client.release();
  })
  .catch(err => {
    console.error('Error acquiring client', err.stack);
  });

module.exports = pool;
