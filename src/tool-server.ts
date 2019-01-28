import * as express from 'express';
import * as http from 'http';
import * as colors from 'colors';

import { configure } from './configure';
import { migrationUser } from './cross-db-migrations/migrations';

export function startToolServer() {
  const app = express();

  app.get('/migration-user', (req, res) => {
    migrationUser();
    res.status(200).send();
  });

  const server = http.createServer(app);
  const port = configure.getConfigByKey('TOOL_SERVE_PORT');
  server.listen(port, '127.0.0.1');

  // tslint:disable-next-line
  console.log(colors.green(`Octopus tool serve on http://127.0.0.1:${port}`));
}

