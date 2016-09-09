import {bookshelf} from '../db/bookshelf.js';
import {UserModel} from './user';

export const TaskCardModel = bookshelf.Model.extend({
  tableName: 'task-card',
  creater: function() {
    return this.belongsTo(UserModel, 'ownerId');
  }
});

export class TaskCard {
  constructor(info) {
    this.model = new TaskCardModel(info);
  }
  
  static createTaskCard(info) {
    return new TaskCard(info);
  }
  
  static getTaskWall() {
    
  }
  
  static getModel() {
    return TaskCardModel;
  }

  static getTaskCard(info) {
    return new TaskCard(info)
  }
}
