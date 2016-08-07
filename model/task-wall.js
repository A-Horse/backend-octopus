'use strict';

import {
  bookshelf
} from '../db/bookshelf.js';

const TaskWallModel = bookshelf.Model.extend({
  tableName: 'task-wall'
});

import {TaskWallAccess} from './Task-wall-access';

export class TaskWall {
  constructor(info) {
    this.model = new TaskWallModel(info);
    return this;
  }

  save() {
    let self = this;
    return new Promise(function(resolve, reject){
      bookshelf.transaction(function(t){
        
        self.model.save(null, {transacting: t})
          .tap(function(taskWall){
            new TaskWallAccess({
              taskWallId: taskWall.get('id'),
              userId: taskWall.get('ownerId'),
              accessLevel: 1
            }).model.save(null, {transacting: t})
              .then(function(){
                t.commit();
                resolve(taskWall);
              })
              .catch(reject);
          });
      });
    });
  }


  // TODO validate field (chekit package)
  static createTaskWall(info) {
    return new TaskWall(info);
  }

  static getTaskWall(info) {
    return new TaskWallModel(info);
  }

  static getModel() {
    return TaskWallModel;
  }
}
