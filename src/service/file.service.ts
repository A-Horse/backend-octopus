import * as R from 'ramda';
import * as md5 from 'blueimp-md5';
import * as fs from 'fs';
import * as path from 'path';
import { configure } from '../config/configure';

export class FileService {
  static async saveBase64Image(base64: string): Promise<string> {
    const imageURLData = base64.replace(/^data:image\/\w+;base64,/, '');
    const hash = md5(imageURLData + Date.now()).substring(0, 20);
    const filename = R.compose(
      R.join('-'),
      R.splitEvery(5)
    )(hash);

    const storagePath: string = configure.get('TASK_COVER_STORAGE_PATH');

    await new Promise((resolve, reject) => {
      fs.writeFile(path.join(storagePath, filename), imageURLData, 'base64', error => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
    });
    return filename;
  }
}
