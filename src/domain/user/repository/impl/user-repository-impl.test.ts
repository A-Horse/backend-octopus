import { setupTestDependency, SetupTestResult } from '../../../../../test/util';
import { UserRepositoryImpl } from './user-repository-impl';
import { UserRepository } from '../user-repository';
import { getRepository } from 'typeorm';
import { UserEntity } from '../../../../orm/user.entity';
import { AppUser } from '../../model/user';

describe('UserRepositoryImpl', () => {
  const repo: UserRepository = new UserRepositoryImpl();
  let setupResult: SetupTestResult;

  beforeAll(async () => {
    jest.setTimeout(30000);
    setupResult = await setupTestDependency();
  });

  afterAll(async () => {
    await setupResult.tearDown();
  });

  test('findAllUser', async () => {
    const u1 = new UserEntity();
    u1.username = 'u1';
    u1.email = 'u1@oc.com';
    u1.hash = '1p1';
    const u2 = new UserEntity();
    u2.username = '云无月';
    u2.email = 'ywy@oc.com';
    u2.hash = 'p2';

    await getRepository(UserEntity).insert(u1);
    await getRepository(UserEntity).insert(u2);

    const users = await repo.findAllUser();
    expect(users.length).toEqual(2);
    expect(users[0] instanceof AppUser);
    expect(users[0].username).toEqual('u1');
  });
});
