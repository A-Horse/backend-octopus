import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/user.entity';
import { getRepository } from 'typeorm';

export async function authUser(username: string, password: string) {
  const user: User = await getRepository(User).findOne({
    where: {
      username
    }
  });
  
  const isPaswdMath = bcrypt.compareSync(user.hash, password);

  if (!isPaswdMath) {
    throw new Error('Passwrod not match');
  }
  return user;
}
