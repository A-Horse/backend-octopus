import { bookshelf } from '../db/bookshelf';
import { UserModel } from './user';
import { TaskCardCommentModel } from './task-card-comment';
import { TaskBoardModel } from './task-board';

export const TaskCardModel = bookshelf.Model.extend({
  tableName: 'task-card2',
  creater: function() {
    return this.belongsTo(UserModel, 'createrId');
  },
  owner: function() {
    return this.belongsTo(UserModel, 'ownerId');
  },
  comments: function() {
    return this.hasMany(TaskCardCommentModel, 'taskCardId');
  },
  board: function() {
    return this.belongsTo(TaskBoardModel, 'taskBoardId');
  }
});

export class TaskCard {
  constructor(info) {
    this.model = new TaskCardModel(info);
  }

  static createTaskCard(info) {
    return new TaskCard(info);
  }

  static getTaskWall() {}

  static getModel() {
    return TaskCardModel;
  }

  static getTaskCard(info) {
    return new TaskCard(info);
  }
}
