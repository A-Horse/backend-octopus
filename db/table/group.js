import {knex} from '../table';

export const createPromise = knex.schema.createTableIfNotExists('group', function (table) {
  table.increments();
  table.integer('taskWallId');
  table.integer('userId');
  table.integer('accessLevel');
});

export const dropPromise = knex.schema.dropTableIfExists('group');
