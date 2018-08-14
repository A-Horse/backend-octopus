import { knex } from '../table';

export const TableName = 'group2';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function(table) {
  table.increments();
  table.integer('taskBoardId');
  table.integer('userId');
  table.integer('accessLevel');
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
