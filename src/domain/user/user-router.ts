import * as express from 'express';
import { authorizedRequestMiddle } from '../../route/middle/auth-handle.middle';
import { UserRepositoryImpl } from './repository/impl/user-repository-impl';
import { UserRepository } from './repository/user-repository';

const UserRouter = express.Router();

/**
 * @typedef User
 * @property {string} id.required
 * @property {string} name.required
 */

/**
 * @route GET /users
 * @group user - Operations about user
 * @returns {Array.<User>} 200 - An array of user
 */
UserRouter.get('/users', authorizedRequestMiddle, async (req, res, next) => {
    const userRepo: UserRepository = new UserRepositoryImpl();
    const users = await userRepo.findAllUser();
    res.json(users);
});

export { UserRouter };
