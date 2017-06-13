import bcrypt from 'bcryptjs';
import R from 'ramda';
import { bookshelf } from '../db/bookshelf.js';

export class UserModal extends bookshelf.Model {
  get tableName() {
    return 'user';
  }

  static async authUser(email, password) {
    const user = this.where({email: email}).fetch();
    if (!user) {
      return false;
    }
    return await bcrypt.compare(password, user.get('password'));
  }
}


export class User {
  constructor() {

  }

  static authUser(queryInfo) {
    return new Promise((resolve, reject) => {
      UserModel.where(R.omit('password', queryInfo))
        .fetch()
        .then((user) => {
          if( !user ){
            return resolve(null);
          }
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
