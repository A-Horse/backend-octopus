import { bookshelf } from '../db/bookshelf';

export const TodoRepeatModel = bookshelf.Model.extend({tableName: 'todo-repeat'});
