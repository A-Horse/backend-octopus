'use strict';

let bcrypt = require('bcryptjs');
let R = require('fw-ramda');

import {
  bookshelf
} from '../db/bookshelf.js';

let UserModel = bookshelf.Model.extend({
  tableName: 'user'
});

export class User {
  constructor() {
    
  }

  static authUser(queryInfo) {
    new Promise((resolve, reject) => {
      UserModel.where(R.omit(queryInfo, 'password'))
        .fetch()
        .then((user) => {
          bcrypt.compare(queryInfo.password, user.get('password'), (error, res) => {
            if (error) return reject(error);
            if (res === true) {
              return resolve(user.omit('password'));
            };
            resolve(null);
          });
        });
    });
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
