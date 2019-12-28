import { AppUser } from '../model/user';

export interface UserRepository {
    findAllUser(): Promise<AppUser[]>
}
