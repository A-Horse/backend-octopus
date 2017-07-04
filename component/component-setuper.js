import express from 'express';
import morgan from 'morgan';
import http from 'http';
import { StatusErrorHandleMiddle } from '../route/middle/error-handle';
import { AliveRouter } from '../route/share/alive';

function SetupComponent(setRouteFn, servePort) {
  const app = express();

  app.set('view engine', 'ejs');
  app.use(morgan('dev'));
  app.use(require('body-parser').json());
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('cookie-parser')());

  app.use(AliveRouter);
  setRouteFn(app);
  app.use(StatusErrorHandleMiddle);
  const server = http.createServer(app);
  server.listen(servePort, '0.0.0.0');
  return app;
}

export default setup;
