import express from 'express';
import morgan from 'morgan';
import http from 'http';
import Ascii from 'ascii-art';
import { StatusErrorHandleMiddle } from '../route/middle/error-handle';
import { AliveRouter } from '../route/share/alive';
import colors from 'colors';

function setupComponent(name, setRouteFn, servePort) {
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

  Ascii.font(`Octopus${name}`, 'Doom', 'bright_blue', (ascii) => {
    console.log(ascii);
    console.log(colors.green(`Octopus ${name} serve on http://127.0.0.1:${servePort}`));
  });

}

export default setupComponent;
