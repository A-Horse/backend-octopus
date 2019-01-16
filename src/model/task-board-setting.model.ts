import { bookshelf } from '../db/bookshelf';

export class TaskBoardSettingModel extends bookshelf.Model {
  get tableName() {
    return 'task-board-setting';
  }
}
