import {knex} from '../table';

export const TableName = 'todo';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.integer('userId');
  table.string('content');
  table.boolean('isDone');
  table.string('repeat');
  table.dateTime('deadline');
  table.string('tags');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
