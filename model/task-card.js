'use strict';

import {
  bookshelf
} from '../db/bookshelf.js';

const TaskCardModel = bookshelf.Model.extend({
  tableName: 'task-wall'
});

export class TaskCard {
  constructor(info) {
    this.model = new TaskCardModel({
      name: info.name,
      ownerId: info.ownerId,
      content: info.content
    });
  }

  // TODO validate field (chekit package)
  static createTaskCard(info) {
    return new TaskCard(info);
  }
  
  static getTaskWall() {
    
  }

  static getModel() {
    return TaskCardModel;
  }
}
