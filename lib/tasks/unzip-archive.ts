import { Promise } from 'es6-promise';
import DeployConfig from '../models/deploy-config';
import TaskBase from './task-base';
import fs = require('fs');
import deleteFolder from '../util/delete-folder';
let unzip = require('unzip');

export default class UnzipArchive extends TaskBase {
  run(config:DeployConfig): Promise<any> {
    return this.unzip(config)
    .then(() => {
      return this.deleteZip(`${config.localPathBase}.zip`);
    })
    .catch((err) => {
      try {
        this.deleteUnzippedFolder(config.localPathBase);
      }
      catch (err2) { }
      throw err;
    });
  }

  private unzip(config:DeployConfig): Promise<any> {
    return new Promise((ok, fail) => {
      let stream = <any>fs.createReadStream(`${config.localPathBase}.zip`)
      .on('error', (err) => {
        fail(err);
      });
      stream.pipe(unzip.Extract({ path: `${config.localPathBase}` }))
      .on('close', () => {
        ok();
      });
    });
  }

  private deleteZip(localPath:string): Promise<any> {
    return new Promise((ok, fail) => {
      fs.unlink(localPath, (err) => {
        if (err) {
          return fail(err);
        }
        ok();
      });
    });
  }

  deleteUnzippedFolder(localPath:string): Promise<any> {
    console.log(`Deleting folder ${localPath}`)
    return deleteFolder(localPath);
  }
}
