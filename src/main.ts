import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { startServer } from "./server";
import { getPostgresConfig } from './config/typeorm-config';

function main() {
  createConnection(getPostgresConfig())
    .then(() => {
      console.log('database connection successful.');

      startServer();
    })
    .catch(error => console.log(error));
}

main();


