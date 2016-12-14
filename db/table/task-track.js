import {knex} from '../table';
import colors from 'colors';

export const TableName = 'task-track';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.integer('taskWallId');
  table.integer('index');
  table.string('name');
  table.string('type');
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
