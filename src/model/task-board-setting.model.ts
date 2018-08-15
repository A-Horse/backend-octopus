import { bookshelf } from '../db/bookshelf.js';

export class TaskBoardSettingModel extends bookshelf.Model {
  get tableName() {
    return 'task-board-setting';
  }
}
