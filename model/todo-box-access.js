import {bookshelf} from '../db/bookshelf.js';

export const TodoBoxAccessModel = bookshelf.Model.extend({tableName: 'todo-box-access'});
