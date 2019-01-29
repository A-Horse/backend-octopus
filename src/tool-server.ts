import * as express from 'express';
import * as http from 'http';
import * as colors from 'colors';

import { configure } from './configure';
import { migrationUser } from './cross-db-migrations/migrations';
import { hashPasswd } from './domain/auth/createUser';

export function startToolServer() {
  const app = express();

  app.get('/migration-user', (req, res) => {
    migrationUser();
    res.status(200).send();
  });

  app.get('/hash-passwd/:password', (req, res) => {
    const password = req.params.password;
    res.status(200).send(hashPasswd(password));
  });

  const server = http.createServer(app);
  const port = configure.getConfigByKey('TOOL_SERVE_PORT');
  server.listen(port, '127.0.0.1');

  // tslint:disable-next-line
  console.log(colors.green(`Octopus tool serve on http://127.0.0.1:${port}`));
}
