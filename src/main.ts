import 'reflect-metadata';

import { createConnection } from 'typeorm';

import { getPostgresConfig } from './config/typeorm-config';
import { startServer } from './server';
import { startToolServer } from './tool-server';
import { catFile } from './util/file-cater';

declare global {
  namespace Express {
    interface Request {
      jw?: {
        user: {
          id: number;
          username: string;
        };
      };
    }
  }
}

function main() {
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
