import * as express from 'express';
import { validate } from '../util/express-validate';
import { param } from 'express-validator';
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
    res.setHeader('Cache-Control', 'max-age=15552000')
    stream.pipe(res);
  };
}
