import {
  bookshelf
} from '../db/bookshelf.js';

import {TaskCard, TaskCardModel} from './task-card';

export const TaskListModel = bookshelf.Model.extend({
  tableName: 'task-list'
});

export const DEFAULT_LIST_NAME = 'default';

export class TaskList {
  constructor(info) {
    this.model = new TaskListModel(info);
  }

  bundleDelete() {
    return new Promise((resolve, reject) => {
      bookshelf.transaction(t => {
        console.log(this.model.id);
        new TaskListModel({taskListId: this.model.id}).fetchAll().then((s) => {
          console.log(s);
        })
        TaskListModel.where({taskListId: this.model.id}).destroy({transacting: t}).then(function(e){
          console.log(e);
        })
        return;
        return Promise.all([
          TaskListModel.where({taskListId: this.model.id}).destroy({transacting: t}),
          this.model.destroy({transacting: t})
        ]).then(() => {
          console.log('hihihi then');
          resolve()
        }).catch(error => {
          console.log('hihihierrr');
          
          reject(error);
        })
      });
    });
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
