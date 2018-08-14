import { bookshelf } from '../db/bookshelf.js';

import { TaskCardModel } from './task-card';

export const TaskTrackModel = bookshelf.Model.extend({
  tableName: 'task-track2',
  bundleDelete() {
    return new Promise((resolve, reject) => {
      bookshelf.transaction(t => {
        return Promise.all([
          TaskCardModel.where({ taskTrackId: this.id }).destroy({ transacting: t }),
          this.destroy({ transacting: t })
        ])
          .then(resolve)
          .catch(error => reject(error));
      });
    });
  },
  cards() {
    return this.hasMany(TaskCardModel, 'taskTrackId');
  }
});

export const DEFAULT_LIST_NAME = 'default';

export class TaskList {
  model: any;
  constructor(info) {
    this.model = new TaskTrackModel(info);
  }

  static createTaskList(info) {
    return new TaskList(info);
  }

  static getModel() {
    return TaskTrackModel;
  }

  static getTaskList(info) {
    return new TaskList(info);
  }
}
