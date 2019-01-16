import { configure } from '../configure';
import { ConnectionOptions } from 'typeorm';

export function getPostgresConfig(): ConnectionOptions {
  return {
    type: 'postgres',
    host: configure.getConfigByKey('POSTGRES_HOST'),
    username: configure.getConfigByKey('POSTGRES_USERNAME'),
    password: configure.getConfigByKey('POSTGRES_PASSWORD'),
    database: configure.getConfigByKey('POSTGRES_DB'),
    synchronize: true,
    logging: true,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    }
  };
}
