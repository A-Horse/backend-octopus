import {knex} from '../table';

export const TableName = 'task-tasking-item';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.string('content');
  table.integer('taskCardId');
  table.integer('createrId');
  table.integer('executorId');
  table.boolean('isDone')
  table.string('status');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
