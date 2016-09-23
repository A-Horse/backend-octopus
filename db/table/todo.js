import {knex} from '../table';

export const createPromise = knex.schema.createTableIfNotExists('todo', function (table) {
  table.increments();
  table.string('title');
  table.boolean('isDone');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists('todo');
