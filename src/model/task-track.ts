import { bookshelf } from '../db/bookshelf.js';

import { TaskCardModel } from './task-card';

export const TaskTrackModel = bookshelf.Model.extend({
  tableName: 'task-track2',
  bundleDelete() {
    return new Promise((resolve, reject) => {
      bookshelf.transaction(t => {
        return Promise.all([
          TaskCardModel.where({ taskTrackId: this.id }).destroy({ transacting: t }),
          this.destroy({ transacting: t })
        ])
          .then(resolve)
          .catch(error => reject(error));
      });
    });
  },
  cards() {
    return this.hasMany(TaskCardModel, 'taskTrackId');
  }
});

export const DEFAULT_LIST_NAME = 'default';

