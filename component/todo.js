import setupComponent from './component-setuper';
import { TodoBoxRouter } from '../route/todo/todo-box';
import { tApiPrefix, todoServePort } from '../constant';

setupComponent(
  'Todo',
  app => {
    app.use(tApiPrefix, TodoBoxRouter);
  },
  todoServePort
);
