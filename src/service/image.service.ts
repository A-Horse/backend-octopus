import { MinioStorage } from '../storage/minio-storage';
import { configure } from '../config/configure';
import { Stream } from 'stream';
const uuidv4 = require('uuid/v4');

export class ImageService {
  constructor(private minioStorage: MinioStorage) {}

  public async saveBase64Image(base64: string): Promise<string> {
    var Readable = require('stream').Readable;
    const imgBuffer = Buffer.from(base64, 'base64');
    var s = new Readable();
    s.push(imgBuffer);
    s.push(null);
    const fileUuid = uuidv4() + '.png';
    await this.minioStorage.saveObject(configure.getConfig().MinIOImageBucketName, fileUuid, s, {
      'Content-Type': 'image/png'
    });
    return fileUuid;
  }

  public getImage(fileName: string): Promise<Stream> {
    return this.minioStorage.getObject(configure.getConfig().MinIOImageBucketName, fileName);
  }
}
