import {knex} from '../table';

export const TableName = 'user';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.string('username');
  table.string('email');
  table.string('status');
  table.string('type');
  table.string('password');
  table.string('desc');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
