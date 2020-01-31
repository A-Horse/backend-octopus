import 'reflect-metadata';

import { createConnection } from 'typeorm';
import { getPostgresConfig } from './config/typeorm-config';
import { startServer } from './server';
import { startToolServer } from './tool-server';
import { catFile } from './util/file-cater';
import { configure } from './config/configure';

import './typing/global';
import { DIContainer } from './container/di-container';
import { MinioClient } from './storage/minio-client';
import { MinioStorage } from './storage/minio-storage';
import { ImageService } from './service/image.service';

async function main() {
  configure.loadConfigureFromFile();
  catFile('./.art/ban.ascii');

  const dbConfig = getPostgresConfig();

  const minioClient = new MinioClient();
  minioClient.init();
  const minioStorage = new MinioStorage(minioClient);
  await minioStorage.createBucketsIfNotExist();
  const diContainer = new DIContainer();
  const imageService = new ImageService(minioStorage);
  diContainer.minioStorage = minioStorage;
  diContainer.imageService = imageService;

  createConnection(dbConfig)
    .then(() => {
      console.log(`connect mysql ${dbConfig.host}/${dbConfig.database}`);
      console.log('database connection successful.');
      startServer(diContainer);
      startToolServer();
    })
    .catch(error => console.log(error));
}

main();
