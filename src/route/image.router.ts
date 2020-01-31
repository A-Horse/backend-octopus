import * as express from 'express';
import { getRepository } from 'typeorm';

import { validate } from '../util/express-validate';
import { query, param } from 'express-validator';
import { authorizedRequestMiddle } from './middle/auth-handle.middle';
import { DIContainer } from 'src/container/di-container';

export class ImageRouter {
  constructor(private container: DIContainer) {}

  public setupRouter(app: express.Application) {
    const router = express.Router();
    router.get('/image/:fileName', validate([param('fileName').isString()]), this.getImage);
    app.use(router);
  }

  /**
   * @route GET /image/:fileName
   * @group image - Operations about image
   * @param {string} fileName.param.required - image file name
   * @returns {object} 200
   */
  private getImage = async (req: express.Request, res: express.Response) => {
    const fileName = req.params.fileName;
    const stream = await this.container.imageService.getImage(fileName);
    stream.pipe(res);
  };
}
