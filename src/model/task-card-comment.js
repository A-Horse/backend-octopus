import {bookshelf} from '../db/bookshelf.js';
import {UserModel} from './user';

export const TaskCardCommentModel = bookshelf.Model.extend({
  tableName: 'task-card-comment',
  creater: function() {
    return this.belongsTo(UserModel, 'createrId');
  }
});
