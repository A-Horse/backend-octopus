import { UserRepository } from '../user-repository';
import { AppUser } from '../../model/user';
import { getRepository } from 'typeorm';
import { UserEntity } from 'src/orm/user.entity';

export class UserRepositoryImpl implements UserRepository {
  async findAllUser(): Promise<AppUser[]> {
    const users: AppUser[] = await getRepository(UserEntity).find();
    return users;
  }
}
