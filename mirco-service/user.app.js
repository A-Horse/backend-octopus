import setupComponent from '../service/component-setuper';

import { userServePort } from '../constant';

import { UserRouter } from './user/user.router';

setupComponent(
  'User',
  app => {
    app.use('/api/user', UserRouter);
  },
  userServePort
);
