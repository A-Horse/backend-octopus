import { getRepository } from 'typeorm';
import { MinioStorage } from 'src/storage/minio-storage';
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
    const fileUuid = uuidv4();
    await this.minioStorage.saveObject(fileUuid, s, {
      'Content-Type': 'image/png',
    });
    return fileUuid;
  }
}
