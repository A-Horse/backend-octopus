import SetupComponent from './component-setuper';
import { WikiListRouter } from '../route/wiki/list';
import { wikiApiPrefix, wikiServePort } from '../constant';

SetupComponent(app => {
  app.use(wikiApiPrefix, WikiListRouter);
}, wikiServePort);
