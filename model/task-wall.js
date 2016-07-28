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
    console.log('info', info);
    this.model = new TaskWallModel({
      name: info.name,
      ownerId: info.ownerId,
      isPublic: info.isPublic
    });
    return this;
  }

  save() {
    let self = this;
    return new Promise(function(resolve, reject){
      console.log('---0');
      bookshelf.transaction(function(t){
        
        self.model.save(null, {transacting: t})
          .tap(function(taskWall){
            console.log('---1');
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
  
  static getTaskWall() {
    
  }

  static getModel() {
    return TaskWallModel;
  }
}
