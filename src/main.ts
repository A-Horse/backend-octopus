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

  const dbConfig = getPostgresConfig()

  createConnection(dbConfig)
    .then(() => {
      console.log(`connect mysql ${dbConfig.host}/${dbConfig.database}`)
      console.log('database connection successful.');
      startServer();
      startToolServer();
    })
    .catch(error => console.log(error));
}

main();
