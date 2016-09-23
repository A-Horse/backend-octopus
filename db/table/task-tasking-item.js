import {knex} from '../table';

export const createPromise = knex.schema.createTableIfNotExists('task-tasking-item', function (table) {
  table.increments();
  table.string('content');
  table.integer('taskCardId');
  table.integer('createrId');
  table.integer('executorId');
  table.boolean('isDone')
  table.string('status');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists('task-tasking-item');
