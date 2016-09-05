import {knex} from '../table';

export const createPromise = knex.schema.createTableIfNotExists('task-list', function (table) {
  table.increments();
  table.integer('taskWallId');
  table.string('name');
  table.string('type');
});

export const dropPromise = knex.schema.dropTableIfExists('task-list');
