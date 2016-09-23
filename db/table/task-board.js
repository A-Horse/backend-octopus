import {knex} from '../table';

export const createPromise = knex.schema.createTableIfNotExists('task-board', function (table) {
  table.increments();
  table.string('name');
  table.integer('ownerId');
  table.boolean('isPublic');
  table.boolean('type');
  table.string('defaultDimensions'); // 维度
  table.timestamps();
});

export const dropPromise = knex.schema.dropTableIfExists('task-board');
