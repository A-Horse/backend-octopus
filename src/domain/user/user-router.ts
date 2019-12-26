import * as express from 'express';
import { authJwt } from '../../route/middle/jwt';

const UserRouter = express.Router();

/**
 * This function comment is parsed by doctrine
 * @route GET /api
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email - eg: user@domain
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
UserRouter.get('/projects', authJwt, async (req, res, next) => {

});


export { UserRouter };
