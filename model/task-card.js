'use strict';

import {
  bookshelf
} from '../db/bookshelf.js';

const TaskCardModel = bookshelf.Model.extend({
  tableName: 'task-card'
});

export class TaskCard {
  constructor(info) {
    this.model = new TaskCardModel(info);
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
