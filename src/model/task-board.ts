import { bookshelf } from '../db/bookshelf.js';

import { TaskTrackModel } from './task-track';
import { GroupModel } from './group';

export const TaskBoardModel = bookshelf.Model.extend({
  tableName: 'task-board',
  cards: () => {},
  tracks: () => {
    return this.hasMany(TaskTrackModel, 'taskBoardId');
  },
  group: () => {
    return this.hasMany(GroupModel, 'taskBoardId');
  }
});

import { Group } from './group';

export const TASKWALL_TYPE = {
  NORMAL: 'NORMAL'
};

export class TaskWall {
  model: any;

  constructor(info) {
    this.model = new TaskBoardModel(info);
    return this;
  }

  public bundleCreate() {
    const self = this;
    return new Promise((resolve, reject) => {
      bookshelf.transaction((t) => {
        self.model.save(null, { transacting: t }).tap((taskWall) => {
          Promise.all([
            new Group({
              taskBoardId: taskWall.get('id'),
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
