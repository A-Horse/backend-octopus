import config from '../service/config.js';

const knex = require('knex')({client: 'sqlite3', connection: {filename: config.getDBPath()}, useNullAsDefault: true});

const bookshelf = require('bookshelf')(knex);

export {bookshelf};
