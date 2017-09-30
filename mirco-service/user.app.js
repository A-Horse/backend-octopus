import setupComponent from '../component/component-setuper';

import { userServePort } from '../constant';

import { UserRouter } from './user/user.router';

setupComponent(
  'Task',
  app => {
    app.use('/api/user', UserRouter);
  },
  userServePort
);
