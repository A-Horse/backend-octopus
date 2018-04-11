import { bookshelf } from '../db/bookshelf.js';

export class TodoModel extends bookshelf.Model {
  get tableName() {
    return 'todo';
  }
}
