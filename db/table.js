'use strict';

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db.sqlite"
  }
});

function createTables(cb) {
  var promise1 = knex.schema.createTableIfNotExists('user', function (table) {
    table.increments();
    table.string('username');
    table.string('password');
    table.timestamps();
  });

  var promise2 = knex.schema.createTableIfNotExists('task-wall', function (table) {
    table.increments();
    table.string('name');
    table.integer('ownerId');
    table.timestamps();
  });

  var promise3 = knex.schema.createTableIfNotExists('task-card', function (table) {
    table.increments();
    table.string('name');
    table.integer('ownerId');
    table.integer('taskCardId');
    table.string('content');
    table.timestamps();
  });
  
  Promise.all([promise1, promise2, promise3]).then(function(){
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
  var promise1 = knex.schema.dropTableIfExists('user');
  var promise2 = knex.schema.dropTableIfExists('task-wall');
  var promise3 = knex.schema.dropTableIfExists('task-card');
  Promise.all([promise1, promise2, promise3]).then(function(){
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
