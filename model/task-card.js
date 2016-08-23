'use strict';

import {
  bookshelf
} from '../db/bookshelf.js';

export const TaskCardModel = bookshelf.Model.extend({
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

  static getTaskCard(info) {
    return new TaskCard(info)
  }
}
