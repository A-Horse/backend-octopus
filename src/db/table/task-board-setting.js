import { knex } from '../table';

export const TableName = 'task-board-setting';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function(table) {
  table.increments();
  table.string('boardId');
  table.string('showType');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
