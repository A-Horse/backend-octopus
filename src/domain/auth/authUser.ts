import { getRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/user.entity';

export async function authUser(email: string, password: string) {
  const user: User = await getRepository(User).findOne({
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
