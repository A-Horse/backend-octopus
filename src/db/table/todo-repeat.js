import {knex} from '../table';

export const TableName = 'todo-repeat';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.string('id');
  table.integer('todoId');
  table.boolean('isDone');
  table.dateTime('doneTime');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);
