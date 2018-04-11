import bluebird from "bluebird";
import fs from 'fs';
import path from 'path';
import {STORAGE_PATH} from '../constant.js';

const pfs = bluebird.promisifyAll(fs);

export function saveFile() {

}

// TODO check create all dir when startup
export async function saveImage(filename, storagePath, data) {
  // TODO path 枚举
  const filePath = path.join(STORAGE_PATH, storagePath, filename);
  return await pfs.writeFileAsync(filePath, data, 'base64');
}
