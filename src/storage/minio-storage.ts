import { MinioClient } from './minio-client';
import { configure } from '../config/configure';
import { Stream } from 'stream';

export class MinioStorage {
  constructor(private minioClient: MinioClient) {}

  // TODO: make sure bucket exist
  public saveObject(objectName: string, stream: Stream, metaData: any = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      this.minioClient
        .getInstance()
        .putObject(
          configure.getConfig().MinIOProjectCoverBucketName,
          objectName,
          stream,
          metaData,
          (err, etag) => {
            if (err) {
              reject(err);
            }
            console.log('etag', etag);
            resolve();
          }
        );
    });
  }
}
