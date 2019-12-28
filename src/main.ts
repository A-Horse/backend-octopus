import 'reflect-metadata';

import { createConnection } from 'typeorm';
import { getPostgresConfig } from './config/typeorm-config';
import { startServer } from './server';
import { startToolServer } from './tool-server';
import { catFile } from './util/file-cater';
import { configure } from './config/configure';

import './typing/global';

function main() {
  configure.loadConfigureFromFile();
  catFile('./.art/ban.ascii');

  createConnection(getPostgresConfig())
    .then(() => {
      console.log('database connection successful.');
      startServer();
      startToolServer();
    })
    .catch(error => console.log(error));
}

main();
