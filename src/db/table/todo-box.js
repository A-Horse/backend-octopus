import {knex} from '../table';

export const TableName = 'todo-box';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.integer('creatorId');
  table.integer('ownerId'); // TODO ADDed
  table.string('name');
  table.string('type');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);