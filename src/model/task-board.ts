import { bookshelf } from '../db/bookshelf';
import { TaskTrackModel } from './task-track';
import { GroupModel } from './group';

export const TaskBoardModel = bookshelf.Model.extend({
  tableName: 'task-board',
  cards() {},
  tracks() {
    return this.hasMany(TaskTrackModel, 'taskBoardId');
  },
  group() {
    return this.hasMany(GroupModel, 'taskBoardId');
  }
});
