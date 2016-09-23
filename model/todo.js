import {bookshelf} from '../db/bookshelf.js';

export const TodoModel = bookshelf.Model.extend({tableName: 'todo'});
