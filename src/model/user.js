import * as bcrypt from 'bcryptjs';
import * as R from 'ramda';
import { bookshelf } from '../db/bookshelf';

export class UserModel extends bookshelf.Model {
  get tableName() {
    return 'user';
  }

  static async authUser(userId, password) {
    const user = await this.where({ id: userId }).fetch();
    if (!user) {
      return false;
    }
    return await bcrypt.compare(password, user.get('password'));
  }

  async updatePassword(newPassword) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    return await this.save({ password: hashedPassword });
  }
}

export class User {
  constructor() {}

  static authUser(queryInfo) {
    return new Promise((resolve, reject) => {
      UserModel.where(R.omit('password', queryInfo))
        .fetch()
        .then(user => {
          if (!user) {
            return resolve(null);
          }
          bcrypt.compare(queryInfo.password, user.get('password'), (error, res) => {
            if (error) return reject(error);
            if (res === true) {
              return resolve(user.omit('password'));
            }
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
          resolve(
            new UserModel(
              Object.assign(info, {
                password: hash
              })
            )
          );
        });
      });
    });
  }

  static getUserById() {}
}
