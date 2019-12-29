import * as express from 'express';
import { authorizedRequestMiddle } from '../../route/middle/auth-handle.middle';

const UserRouter = express.Router();

/**
 * @route GET /users
 * @group user - Operations about user
 * @param {string} email.query.required - username or email - eg: user@domain
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
UserRouter.get('/users', authorizedRequestMiddle, async (req, res, next) => {});

export { UserRouter };
