import { bookshelf } from '../db/bookshelf';

export const GroupModel = bookshelf.Model.extend({
  tableName: 'group2'
});

export class Group {
  constructor(info) {
    this.model = new GroupModel({
      taskBoardId: info.taskBoardId,
      userId: info.userId
    });
    return this;
  }

  save() {}

  static getModel() {
    return GroupModel;
  }
}
