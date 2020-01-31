import { MinioClient } from './minio-client';
import { configure } from '../config/configure';
import { Stream } from 'stream';

export class MinioStorage {
  constructor(private minioClient: MinioClient) {}

  public async createBucketsIfNotExist() {
    return Promise.all(
      [configure.getConfig().MinIOImageBucketName].map((bucketName: string) => {
        return new Promise((resolve, reject) => {
          this.minioClient.getInstance().bucketExists(bucketName, (err, exists) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            if (exists) {
              return resolve();
            }
            this.minioClient.getInstance().makeBucket(bucketName, err => {
              if (err) {
                console.log(`Error creating bucket [${bucketName}].`, err);
                reject(err);
              }
              console.log(`Bucket [${bucketName}] created successfully`);
              resolve();
            });
          });
        });
      })
    );
  }

  public saveObject(bucketName: string, objectName: string, stream: Stream, metaData: any = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      this.minioClient.getInstance().putObject(bucketName, objectName, stream, metaData, (err, etag) => {
        if (err) {
          reject(err);
        }
        resolve(etag);
      });
    });
  }

  public getObject(bucketName: string, objectName: string): Promise<Stream> {
    return new Promise((resolve, reject) => {
      this.minioClient.getInstance().getObject(bucketName, objectName, function(err, stream) {
        if (err) {
          return reject(err);
        }
        return resolve(stream);
      });
    });
  }
}
