import * as bluebird from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';

import { STORAGE_PATH } from '../constant.js';

const writeFile: (...args: any[]) => bluebird<void> = bluebird.promisify(fs.writeFile);

// TODO check create all dir when startup
export async function saveImage(filename, storagePath, data) {
  const filePath = path.join(STORAGE_PATH, storagePath, filename);
  return await writeFile(filePath, data, 'base64');
}
