import { UserEntity } from '../../../orm/user.entity';

export class AppUser {
  public id: number;
  public username: string;
  public email: string;

  constructor(userEntity: UserEntity | undefined) {
    if (!userEntity) {
      return;
    }
    this.id = userEntity.id;
    this.username = userEntity.username;
    this.email = userEntity.email;
  }
}
