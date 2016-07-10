'use strict';

let bcrypt = require('bcryptjs');

import {
  bookshelf
} from '../db/bookshelf.js';

let UserModel = bookshelf.Model.extend({
  tableName: 'user'
});

export class User {
  constructor() {
    
  }

  // TODO validate field (chekit package)
  // FIXME
  static createUser(info) {
    return new Promise(function(resolve, reject) {
      let password = info.password;
      bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(password, salt, (error, hash) => {
          resolve(new UserModel(Object.assign(info, {
            password: hash
          })));
        });
      });
      
    });
  }

  static getUserById() {
    
  }
}
