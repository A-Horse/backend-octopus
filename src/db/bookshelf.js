import config from '../service/config.js';
import path from 'path';

export const knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: path.join(__dirname, config.getDBPath()) },
  useNullAsDefault: true
});

const bookshelf = require('bookshelf')(knex);

export { bookshelf };
