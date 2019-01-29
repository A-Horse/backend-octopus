import { UserModel } from '../model/user';
import { User } from '../entity/user.entity';
import { getRepository } from 'typeorm';

export async function migrationUser() {
  const users = await new UserModel().fetchAll();
  users.forEach(async (user: UserModel) => {
    const newUser = new User();

    newUser.id = user.get('id');
    newUser.hash = user.get('password');
    newUser.email = user.get('email');
    newUser.username = user.get('username');

    await getRepository(User).save(newUser);
  });
}
