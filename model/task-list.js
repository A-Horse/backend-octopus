import {
  bookshelf
} from '../db/bookshelf.js';

import {TaskCardModel} from './task-card';

export const TaskListModel = bookshelf.Model.extend({
  tableName: 'task-list',
  bundleDelete() {
    return new Promise((resolve, reject) => {
      bookshelf.transaction(t => {
        return Promise.all([
          TaskCardModel.where({taskListId: this.id}).destroy({transacting: t}),
          this.destroy({transacting: t})
        ]).then(resolve).catch(error => reject(error))
      });
    });
  },
  cards: function() {
    return this.hasMany(TaskCardModel, 'taskListId');
  }
}); 

export const DEFAULT_LIST_NAME = 'default';

export class TaskList {
  constructor(info) {
    this.model = new TaskListModel(info);
  }

  static createTaskList(info) {
    return new TaskList(info);
  }
  
  static getModel() {
    return TaskListModel;
  }

  static getTaskList(info) {
    return new TaskList(info)
  }
}
