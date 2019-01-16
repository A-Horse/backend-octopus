import {bookshelf} from '../db/bookshelf';
import {UserModal} from './user';
import {TodoBoxModel} from './todo-box';

export const TodoBoxAccessModel = bookshelf.Model.extend({
  tableName: 'todo-box-access',
  user: () => {
    return this.belongsTo(UserModal);
  },
  todoBoxs: () => {
    return this.belongsTo(TodoBoxModel);
  }
});
