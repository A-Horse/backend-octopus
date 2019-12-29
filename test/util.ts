import { createConnection, ConnectionOptions } from 'typeorm';
import { getPostgresConfig } from '../src/config/typeorm-config';
import { configure } from '../src/config/configure';

function getKnex(connectionOption: ConnectionOptions | any) {
  return require('knex')({
    client: connectionOption.type,
    connection: {
      host: connectionOption.host,
      user: connectionOption.username,
      password: connectionOption.password,
      charset: 'utf8'
    }
  });
}

async function createDatabase(
  connectionOption: ConnectionOptions | any,
  dbName: string
): Promise<void> {
  const knex = getKnex(connectionOption);

  await knex.raw(`CREATE DATABASE ${dbName}`);
  knex.destroy();
}

async function dropDatabase(
  connectionOption: ConnectionOptions | any,
  dbName: string
): Promise<void> {
  const knex = getKnex(connectionOption);

  await knex.raw(`DROP DATABASE ${dbName}`);
  knex.destroy();
}

function makeRandomString(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function setupTestTypeorm(dbName: string): Promise<void> {
  const connection = await createConnection(getPostgresConfig());
  await connection.query('CREATE DATABASE IF NOT EXISTS ' + dbName);
  await connection.synchronize(true);
}

export interface SetupTestResult {
  tearDown: Function;
}

export async function setupTestDependency(): Promise<SetupTestResult> {
  const testMysqlDBName = `octopus_test_${makeRandomString(14)}`;
  configure.loadConfigureFromFile('test-config.yaml');
  configure.set('MYSQL_DB', testMysqlDBName);

  const dbOption = getPostgresConfig();

  await createDatabase(dbOption, testMysqlDBName);
  await setupTestTypeorm(testMysqlDBName);

  return {
    tearDown: async () => {
      await dropDatabase(dbOption, testMysqlDBName);
    }
  };
}
