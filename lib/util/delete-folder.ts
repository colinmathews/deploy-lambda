import fs = require('fs');
import execute from './execute';

export default function deleteFolder(localPath) {
  return new Promise((ok, fail) => {
    fs.exists(localPath, (exists) => {
      return ok(exists);
    })
  })
  .then((exists) => {
    return execute(`rm -rf ${localPath}`);
  });
}
