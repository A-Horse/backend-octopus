import * as bcrypt from 'bcryptjs';
import { getRepository } from 'typeorm';

import { UserEntity } from '../../entity/user.entity';

export function hashPasswd(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export async function crerateUser({ email, username, password }): Promise<void> {
  const user = new UserEntity();
  user.email = email;
  user.username = username;

  const hash = hashPasswd(password);

  user.hash = hash;

  await getRepository(UserEntity).save(user);
}
