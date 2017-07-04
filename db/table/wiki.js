import { knex } from '../table';

export const TableName = 'wiki';

export const createPromise = knex.schema.createTableIfNotExists(
  TableName,
  function(table) {
    table.string('id');
    table.string('title');
    table.string('content');
    table.string('createrId');
    table.boolean('isDelete');
    table.timestamps();
  }
);

export const dropPromise = knex.schema.dropTableIfExists(TableName);
