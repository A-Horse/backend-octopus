import * as fs from 'fs';
import * as colors from 'colors';

export function catFile(filePath: string) {
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) throw err;
    console.log(colors.red(data));
  });
}
