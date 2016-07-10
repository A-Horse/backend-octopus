'use strict';

import {
  bookshelf
} from '../db/bookshelf.js';

const TaskWallModel = bookshelf.Model.extend({
  tableName: 'task-wall'
});

export class TaskWall {
  constructor(info) {
    this.model = new TaskWallModel({
      name: info.name,
      ownerId: info.ownerId
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
