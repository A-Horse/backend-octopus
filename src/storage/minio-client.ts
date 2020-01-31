import { configure } from '../config/configure';
import * as Minio from 'minio';

export class MinioClient {
  private instance;

  constructor() {}

  init() {
    this.instance = new Minio.Client({
      endPoint: configure.getConfig().MinIOEndPoint,
      port: 443,
      useSSL: true,
      accessKey: configure.getConfig().MinIOAccessKey,
      secretKey: configure.getConfig().MinIOSecretKey
    });
  }

  getInstance() {
    return this.instance;
  }
}
