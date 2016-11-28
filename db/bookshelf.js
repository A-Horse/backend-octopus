'use strict';

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db/db.sqlite"
  }
});

var bookshelf = require('bookshelf')(knex);

export {bookshelf};
