import fs from 'fs';
import config from '../service/config.js';

// TODO log which table created
export const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: config.getDBPath()
  }
});

function readAllLib() {
  return fs.readdirSync('./db/table').filter(fileName => /\.js$/.test(fileName))
    .map(fileName => require(`./table/${fileName}`));
}

function createTables(cb) {
  const createPromises = readAllLib().map(module => module.createPromise);
  Promise.all(createPromises).then(() => {
    cb && cb(() => {process.exit(0)});
    !cb && process.exit(0);
  }).catch(error => console.error(error));
}

function dropTables(cb) {
  const dropPromises = readAllLib().map(module => module.dropPromise);
  Promise.all(dropPromises).then(() => {
    cb && cb(() => {process.exit(0)});
    !cb && process.exit(0);
  }).catch(error => console.error(error));
}

switch(process.argv[2]) {
case 'create':
  console.log('create table');
  createTables();
  break;
case 'drop':
  console.log('drop table');
  dropTables();
  break;
case 'truncate':
  console.log('truncate table');
  dropTables(createTables);
  break;
default:
  console.log('node table.js <create | drop | truncate>');
}
