'use strict';

import {
  bookshelf
} from '../db/bookshelf.js';

let PageModel = bookshelf.Model.extend({
  tableName: 'pages'
});


export class Page {
  constructor(id, title, content, date) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.created_at = date || new Date();

    this.model = null;
    return this;
  }

  isValid() {
    return !!this.id &&
      !!this.title &&
      !!this.content &&
      !! this.createDate;
  }

  save(cb) {
    let self = this;
    this.model = new PageModel({
      title: this.title,
      content: this.content,
      created_at: this.created_at
    });

    this.model.save()
      .then((model) => {
        self.id = model.id;
        cb && cb(self);
      });
    
    // if( this.isValid() ){
    // } else {
    //   throw Error(`This page is no valid! id: ${this.id} title: ${this.title}`);
    // }
  }

  toString() {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      content: this.content,
      created_at: this.created_at.toString()
    });
  }

  static getPageById(id) {
    return PageModel.where({id: id}).fetch()
  }
}
