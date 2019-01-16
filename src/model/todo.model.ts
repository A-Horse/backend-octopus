import { bookshelf } from '../db/bookshelf';

export class TodoModel extends bookshelf.Model {
  get tableName() {
    return 'todo';
  }
}
