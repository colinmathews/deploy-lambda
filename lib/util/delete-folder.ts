import fs = require('fs');
import execute from './execute';

export default function deleteFolder(localPath: string): Promise<any> {
  'use strict';
  return new Promise((ok, fail) => {
    fs.exists(localPath, (exists) => {
      return ok(exists);
    });
  })
  .then((exists) => {
    return execute(`rm -rf ${localPath}`);
  });
}
