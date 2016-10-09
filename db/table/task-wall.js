import {knex} from '../table';

export const createPromise = knex.schema.createTableIfNotExists('task-wall', function (table) {
  table.increments();
  table.string('name');
  table.integer('ownerId');
  table.boolean('isPublic');
  table.boolean('type');
  table.string('sprint');
  table.string('cover')
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists('task-wall');
