import { Promise } from 'es6-promise';
import DeployConfig from '../models/deploy-config';
import TaskBase from './task-base';
import deleteFolder from '../util/delete-folder';
let Zip = require('easy-zip2').EasyZip;

export default class ZipApplication extends TaskBase {
  run(config:DeployConfig): Promise<any> {
    let zip = new Zip();
    console.log(`Zipping deploy folder ${config.localPathBase}...`);
    return this.zipFolder(zip, config)
    .then(() => {
      console.log(`Writing to ${config.localPathBase}.zip...`)
      return this.writeZip(zip, config);
    })
    .then(() => {
      console.log(`Deleting deploy folder ${config.localPathBase}...`)
      return deleteFolder(config.localPathBase);
    });
  }

  private zipFolder(zip, config:DeployConfig): Promise<any> {
    return new Promise((ok, fail) => {
      zip.zipFolder(config.localPathBase, {
        rootFolder: ''
      }, (err, result) => {
        if (err) {
          return fail(err);
        }
        ok(result);
      });
    });
  }

  private writeZip(zip, config:DeployConfig): Promise<any> {
    return new Promise((ok, fail) => {
      zip.writeToFile(`${config.localPathBase}.zip`, (err, result) => {
        if (err) {
          return fail(err);
        }
        ok(result);
      });
    });
  }
}
