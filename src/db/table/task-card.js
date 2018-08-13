import { knex } from '../table';

export const TableName = 'task-card2';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function(table) {
  table.increments();
  table.string('title');
  table.integer('taskTrackId');
  table.integer('createrId');
  table.integer('ownerId');
  table.integer('taskBoardId');
  table.string('content');
  table.boolean('isDone');
  table.string('type');
  table.string('status');
  table.integer('index');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
