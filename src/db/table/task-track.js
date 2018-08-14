import { knex } from '../table';

export const TableName = 'task-track2';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function(table) {
  table.increments();
  table.integer('taskBoardId');
  table.integer('index');
  table.string('name');
  table.string('type');
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
