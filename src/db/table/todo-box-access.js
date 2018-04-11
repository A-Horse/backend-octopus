import {knex} from '../table';

export const TableName = 'todo-box-access';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.integer('todoBoxId');
  table.string('userId');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
