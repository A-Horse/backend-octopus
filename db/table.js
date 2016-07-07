'use strict';

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db.sqlite"
  }
});

function createTables(cb) {
  var promise1 = knex.schema.createTableIfNotExists('users', function (table) {
    table.increments();
    table.string('name');
    table.string('password');
    table.timestamps();
  });

  var promise2 = knex.schema.createTableIfNotExists('pages', function (table) {
    table.increments();
    table.string('title');
    table.string('content');
    table.string('type');
    table.timestamps();
  });
  
  Promise.all([promise1, promise2]).then(function(){
    if( cb ){
      cb(() => {
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
}

function dropTables(cb) {
  var promise1 = knex.schema.dropTable('users');
  var promise2 = knex.schema.dropTable('pages');
  Promise.all([promise1, promise2]).then(function(){
    if( cb ){
      cb(() => {
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
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
