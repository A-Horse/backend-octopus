import {knex} from '../table';

export const TableName = 'todo-task-link';

export const createPromise = knex.schema.createTableIfNotExists(TableName, function (table) {
  table.increments();
  table.integer('todoId');
  table.string('taskCardLink');
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists(TableName);

