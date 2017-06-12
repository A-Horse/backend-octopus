'use strict';

import {
  bookshelf
} from '../db/bookshelf.js';

export const GroupModel = bookshelf.Model.extend({
  tableName: 'group'
});

export class Group {
  constructor(info) {
    this.model = new GroupModel({
      taskWallId: info.taskWallId,
      userId: info.userId
    });
    return this;
  }

  save() {

  }

  static getModel() {
    return GroupModel;
  }
}
