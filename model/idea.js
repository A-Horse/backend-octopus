import {bookshelf} from '../db/bookshelf.js';
import {UserModel} from './user';

export const IdeaModel = bookshelf.Model.extend({
  tableName: 'idea'
});
