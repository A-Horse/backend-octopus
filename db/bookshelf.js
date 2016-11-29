import config from '../service/config.js';

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: `./db/db-${config.getEnvirType()}.sqlite`
  }
});

var bookshelf = require('bookshelf')(knex);

export {bookshelf};
