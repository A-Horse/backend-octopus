import {knex} from '../table';

const TableName = 'todo';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.integer('userId');
  table.string('content');
  table.boolean('isDone');
  table.string('repeat');
  table.string('tags');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
