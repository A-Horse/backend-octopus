import {knex} from '../table';

export const TableName = 'task-card';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.string('title');
  table.integer('taskListId');
  table.string('sprint');
  table.integer('createrId');
  table.integer('ownerId');
  table.integer('executorId');
  table.integer('taskWallId');
  table.string('content');
  table.boolean('isDone')
  table.string('status');
  table.integer('index');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
