import { bookshelf } from '../db/bookshelf';

export class TodoRepeatModel extends bookshelf.Model {
  get tableName() {
    return 'todo-repeat';
  }
}
