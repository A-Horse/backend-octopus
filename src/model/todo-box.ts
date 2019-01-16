import { bookshelf } from '../db/bookshelf';

export const TodoBoxModel = bookshelf.Model.extend({ tableName: 'todo-box' });
