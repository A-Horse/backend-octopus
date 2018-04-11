import { knex } from '../table';

export const TableName = 'task-access';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function(table) {
  table.increments();
  table.string('userId');
  table.string('boardId');
  table.string('level');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
