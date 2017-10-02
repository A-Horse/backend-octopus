import { bookshelf } from '../db/bookshelf.js';
import { UserModel } from './user';

export const TaskAccessModel = bookshelf.Model.extend({
  tableName: 'task-access',
  user: function() {
    return this.belongsTo(UserModel, 'userId');
  },
  board: function() {
    return this.belongsTo(UserModel, 'boardId');
  }
});
