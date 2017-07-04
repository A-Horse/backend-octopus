import setupComponent from './component-setuper';
import { WikiListRouter } from '../route/wiki/list';
import { wikiApiPrefix, wikiServePort } from '../constant';

setupComponent(
  'Wiki',
  app => {
    app.use(wikiApiPrefix, WikiListRouter);
  },
  wikiServePort
);
