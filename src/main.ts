import 'reflect-metadata';

import { createConnection } from 'typeorm';
import { getTypeOrmConfig } from './config/typeorm-config';
import { startServer } from './server';
import { startToolServer } from './tool-server';
import { catFile } from './util/file-cater';
import { configure } from './config/configure';

import './typing/global';
import { DIContainer } from './container/di-container';
import { MinioClient } from './storage/minio-client';
import { MinioStorage } from './storage/minio-storage';
import { ImageService } from './service/image.service';
import { ProjectRepository } from './domain/project/project-repository';

async function main() {
  configure.loadConfigureFromFile();
  catFile('./.art/ban.ascii');

  const dbConfig = getTypeOrmConfig();

  const minioClient = new MinioClient();
  minioClient.init();
  const minioStorage = new MinioStorage(minioClient);
  await minioStorage.createBucketsIfNotExist();
  const diContainer = new DIContainer();
  const imageService = new ImageService(minioStorage);
  diContainer.minioStorage = minioStorage;
  diContainer.imageService = imageService;

  const projectRepository = new ProjectRepository();
  diContainer.projectRepository = projectRepository;

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
