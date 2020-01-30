import * as express from 'express';
import { getRepository } from 'typeorm';
import { validate } from '../util/express-validate';
import { query, param } from 'express-validator';
import { authorizedRequestMiddle } from './middle/auth-handle.middle';

const ImageRouter = express.Router();

/**
 * @route GET /image/:id
 * @group image - Operations about image
 * @param {int} id.param.required - image id
 * @returns {object} 200 - An array of user info
 */
ImageRouter.get('/image/:id', validate([param('id').isInt()]), authorizedRequestMiddle, async (req, res) => {
  return res.status(200).json({});
});

export { ImageRouter };
