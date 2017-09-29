import setupComponent from '../component/component-setuper';

import { taskServePort } from '../constant';

import { TaskBoardRouter } from './task/task-board.router';

setupComponent(
  'Task',
  app => {
    app.use('/api/tk', TaskBoardRouter);
  },
  taskServePort
);
