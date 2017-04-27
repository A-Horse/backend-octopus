import {knex} from '../table';

export const TableName = 'todo';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.integer('userId');
  table.interer('todoBoxId');
  table.string('content');
  table.string('remark');
  table.boolean('isDone');
  table.boolean('isStar');
  table.string('repeat');
  table.dateTime('deadline');
  table.string('tags');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
