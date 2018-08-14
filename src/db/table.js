import * as fs from 'fs';
import * as colors from 'colors';

const dbpath = './db/db.sqlite';
console.log(colors.green(`USED DB: ${dbpath}`));

export const knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: dbpath },
  useNullAsDefault: true // http://knexjs.org/#Builder-insert
});

function readAllLib() {
  return fs
    .readdirSync('./src/db/table')
    .filter(fileName => /\.js$/.test(fileName))
    .map(fileName => require(`./table/${fileName}`));
}

function createTables(cb) {
  const tableModules = readAllLib();
  const createPromises = tableModules.map(tableModule => {
    return knex.schema.hasTable(tableModule.TableName).then(function(exists) {
      if (!exists) {
        console.log(
          colors.green(`       Creating table: >-  ${colors.blue(tableModule.TableName)} -<`)
        );
        return tableModule.createPromise;
      }
    });
  });
  Promise.all(createPromises)
    .then(() => {
      cb &&
        cb(() => {
          process.exit(0);
        });
      !cb && process.exit(0);
    })
    .catch(error => console.error(error));
}

function dropTables(cb) {
  const dropPromises = readAllLib().map(module => module.dropPromise);
  Promise.all(dropPromises)
    .then(() => {
      cb &&
        cb(() => {
          process.exit(0);
        });
      !cb && process.exit(0);
    })
    .catch(error => console.error(error));
}

switch (process.argv[2]) {
  case 'create':
    console.log(colors.yellow('COMMAND: create table'));
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
