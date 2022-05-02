const { Pool, Client } = require('pg');
//require('dotenv').config();
const configJS = require('../config');

const config = {
  user: configJS.USER,
  host: configJS.HOST,
  database: 'qna',
  password: configJS.PASSWORD,
  port: 5432,
  max: 20
};
const pool = new Pool(config);
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(result.rows)
  })
})

//const client = new Client(config);
//client.connect();
module.exports = pool;
//module.exports.client = new Client(config);


