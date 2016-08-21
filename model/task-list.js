import {
  bookshelf
} from '../db/bookshelf.js';

export const TaskListModel = bookshelf.Model.extend({
  tableName: 'task-list'
});

export const DEFAULT_LIST_NAME = 'default';

export class TaskList {
  constructor(info) {
    info.name = info.name || DEFAULT_LIST_NAME;
    this.model = new TaskListModel(info);
  }

  static createTaskList(info) {
    return new TaskList(info);
  }
  
  static getModel() {
    return TaskListModel;
  }

  static getTaskList(info) {
    return new TaskList(info)
  }
}
