import { bookshelf } from '../db/bookshelf.js';

export const TodoBoxModel = bookshelf.Model.extend({ tableName: 'todo-box' });
