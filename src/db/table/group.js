import { knex } from '../table';

export const TableName = 'group2';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function(table) {
  table.increments();
  table.integer('taskBoardId');
  table.integer('createrId');
  table.integer('accessLevel');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
