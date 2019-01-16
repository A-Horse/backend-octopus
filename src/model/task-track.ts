import { bookshelf } from '../db/bookshelf';

import { TaskCardModel } from './task-card';

export const TaskTrackModel = bookshelf.Model.extend({
  tableName: 'task-track2',
  bundleDelete() {
    return new Promise((resolve, reject) => {
      bookshelf.transaction(t => {
        return Promise.all([
          TaskCardModel.where({ taskTrackId: this.id }).save(
            {
              status: 'DELETED'
            },
            { transacting: t, method: 'update' }
          ),
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
