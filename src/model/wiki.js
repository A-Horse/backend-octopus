import { bookshelf } from '../db/bookshelf.js';

export class WikiModel extends bookshelf.Model {
  get tableName() {
    return 'wiki';
  }
}
