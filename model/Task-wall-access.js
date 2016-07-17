'use strict';

import {
  bookshelf
} from '../db/bookshelf.js';

const TaskWallAccessModel = bookshelf.Model.extend({
  tableName: 'task-wall-access'
});


export class TaskWallAccess {
  constructor(info) {
    this.model = new TaskWallAccessModel({
      taskWallId: info.taskWallId,
      userId: info.userId
    });
    return this;
  }

  save() {
    
  }

  
  static getModel() {
    return TaskWallAccessModel;
  }
}
