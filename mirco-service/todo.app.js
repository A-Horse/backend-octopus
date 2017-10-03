import setupComponent from '../component/component-setuper';
import { tApiPrefix, todoServePort } from '../constant';
import { TodoBoxRouter } from '../route/todo/todo-box';
import { TodoRouter } from './todo/todo.router';

setupComponent(
  'Todo',
  app => {
    app.use(tApiPrefix, TodoBoxRouter);
    app.use(tApiPrefix, TodoRouter);
  },
  todoServePort
);
