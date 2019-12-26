import * as bcrypt from 'bcryptjs';
import { getRepository } from 'typeorm';

import { UserEntity } from '../../orm/user.entity';

export async function authUser(email: string, password: string) {
  const user: UserEntity = await getRepository(UserEntity).findOne({
    where: {
      email
    }
  });

  const isPaswdMath = bcrypt.compareSync(password, user.hash);
  if (!isPaswdMath) {
    throw new Error('Passwrod not match');
  }
  return user;
}
