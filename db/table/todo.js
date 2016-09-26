import {knex} from '../table';

export const createPromise = knex.schema.createTableIfNotExists('todo', function (table) {
  table.increments();
  table.integer('userId');
  table.string('content');
  table.boolean('isDone');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists('todo');
