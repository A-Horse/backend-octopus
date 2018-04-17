import { bookshelf } from '../db/bookshelf.js';

import { TaskListModel } from './task-track';
import { GroupModel } from './group';

export const TaskBoardModel = bookshelf.Model.extend({
  tableName: 'task-board',
  cards: function() {},
  tracks: function() {
    return this.hasMany(TaskListModel, 'taskWallId');
  },
  group: function() {
    return this.hasMany(GroupModel, 'taskWallId');
  }
});

import { Group } from './group';
import { TaskList, DEFAULT_LIST_NAME } from './task-list';

export const TASKWALL_TYPE = {
  NORMAL: 'NORMAL'
};

export class TaskWall {
  constructor(info) {
    this.model = new TaskBoardModel(info);
    return this;
  }

  bundleCreate() {
    const self = this;
    return new Promise(function(resolve, reject) {
      bookshelf.transaction(function(t) {
        self.model.save(null, { transacting: t }).tap(function(taskWall) {
          Promise.all([
            new Group({
              taskWallId: taskWall.get('id'),
              userId: taskWall.get('ownerId'),
              accessLevel: 1
            }).model.save(null, { transacting: t })
          ])
            .then(() => {
              t.commit();
              resolve(taskWall);
            })
            .catch(error => {
              t.rollback();
              reject(error);
            });
        });
      });
    });
  }

  static createTaskWall(info) {
    return new TaskWall(info);
  }

  static getTaskWall(info) {
    return new TaskBoardModel(info);
  }

  static getModel() {
    return TaskBoardModel;
  }
}
