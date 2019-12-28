import * as jwt from 'jsonwebtoken';

import { configure } from '../config/configure';
import { authUser } from '../domain/auth/authUser';
import { crerateUser } from '../domain/auth/createUser';
import { UserEntity } from '../orm/user.entity';

export interface AuthedData {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

class AuthService {
  public async login(email: string, password: string): Promise<AuthedData> {
    const user: UserEntity = await authUser(email, password);
    const token = this.signJwt(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };
  }

  public async signup({ email, username, password }): Promise<void> {
    return await crerateUser({ email, username, password });
  }

  public unsignJwt(token: string) {
    return jwt.verify(token, configure.get('SECRET_KEY'));
  }

  private signJwt(user: UserEntity): string {
    return jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email
        },
        exp:
          Math.floor(Date.now() / 1000) +
          (configure.get('JWT_EXP_HOURS') as number) * 60 * 60
      },
      configure.get('SECRET_KEY')
    );
  }
}

export const authServive = new AuthService();
