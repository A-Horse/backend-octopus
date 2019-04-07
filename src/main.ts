import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { startServer } from './server';
import { getPostgresConfig } from './config/typeorm-config';
import { startToolServer } from './tool-server';

declare global {
  namespace Express {
    interface Request {
      jw?: {
        user: {
          id: number;
          username: string;
        }
      };
    }
  }
}

function main() {
  createConnection(getPostgresConfig())
    .then(() => {
      console.log('database connection successful.');

      startServer();
      startToolServer();
    })
    .catch(error => console.log(error));
}

main();
