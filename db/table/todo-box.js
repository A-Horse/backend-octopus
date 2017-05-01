import {knex} from '../table';

export const TableName = 'todo-box';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.integer('creatorId');
  table.string('name');
  table.type('type');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
