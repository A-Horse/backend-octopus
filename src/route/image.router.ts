import * as express from 'express';
import { getRepository } from 'typeorm';
import { Base64Entity } from 'src/orm/base64.entity';
import { validate } from '../util/express-validate';
import { query, param } from 'express-validator';
import { authorizedRequestMiddle } from './middle/auth-handle.middle';

const ImageRouter = express.Router();

/**
 * @route GET /image/:id
 * @group image - Operations about image
 * @param {int} id.query.required - image id
 * @returns {object} 200 - An array of user info
 */
ImageRouter.get(
  '/image/:id',
  validate([param('id').isInt()]),
  authorizedRequestMiddle,
  async (req, res) => {
    const base64Entity: Base64Entity = await getRepository(Base64Entity).findOne(req.params.id);
    return res.status(200).json({
      result: base64Entity.value
    })
  }
);

export { ImageRouter };
