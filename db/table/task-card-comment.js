import {knex} from '../table';

const TableName = 'task-card-comment';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.integer('taskCardId');
  table.integer('createrId');
  table.string('content');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
