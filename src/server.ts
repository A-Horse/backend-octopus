import * as colors from 'colors';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as morgan from 'morgan';
import * as path from 'path';
import * as helmet from 'helmet';
import rfs from 'rotating-file-stream';
import { configure } from './config/configure';
import { KanbanColumnRouter } from './domain/kanban-column/kanban-column-router';
import { KanbanRouter } from './domain/kanban/kanban-router';
import { ProjectIssueRouter } from './domain/project-issue/project-issue-router';
import { ProjectRouter } from './domain/project/project-router';
import { StatusErrorHandleMiddle } from './route/middle/status-error-handle.middle';
import { RootRouter } from './route/root';
import { AuthRouter } from './route/user.router';
import { generateSwagger } from './util/swagger-helper';
import { ImageRouter } from './route/image.router';
import { UserRouter } from './domain/user/user-router';
import { DIContainer } from './container/di-container';
require('express-async-errors');


function initExpressApp(container: DIContainer): express.Application {
  const app = express();
  // TODO configure.get('LOG_PATH')
  const logDirectory = path.join(__dirname, '../log/access');

  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  const accessLogStream = rfs('access.log', {
    interval: '1d',
    path: logDirectory
  });

  app.use(helmet()); // for secure
  app.use(morgan('dev'));
  app.use(morgan('combined', { stream: accessLogStream }));

  app.use(require('body-parser').json());
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('cookie-parser')());

  app.use(RootRouter);
  app.use(ImageRouter);
  app.use(UserRouter);
  app.use('/user', AuthRouter);

  const projectRouter = new ProjectRouter(container);
  projectRouter.setupRouter(app);

  app.use(KanbanRouter);
  app.use(KanbanColumnRouter);
  app.use(ProjectIssueRouter);

  app.use(StatusErrorHandleMiddle);

  return app;
}

export function startServer(container: DIContainer): http.Server {
  const app = initExpressApp(container);

  configure.get('SWAGGER') && generateSwagger(app);

  const server = http.createServer(app);
  server.listen(configure.getConfig().SERVE_PORT, '0.0.0.0');
  console.log(
    colors.green(`Octopus serve on http://0.0.0.0:${configure.getConfig().SERVE_PORT}`)
  );
  return server;
}
