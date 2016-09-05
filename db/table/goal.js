import {knex} from '../table';

export const createPromise = knex.schema.createTableIfNotExists('goal', function (table) {
  table.increments();
  table.integer('userId');
  table.string('title');
  table.string('content');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists('goal');
