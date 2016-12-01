import {knex} from '../table';

const TableName = 'task-board';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.string('name');
  table.integer('ownerId');
  table.integer('createrId');
  table.boolean('isPublic');
  table.boolean('type');
  table.string('sprint');
  table.string('cover');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
