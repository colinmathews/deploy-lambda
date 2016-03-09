import { Promise } from 'es6-promise';
import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';
import fs = require('fs');
let knox = require('knox');
let AWS = require('aws-sdk');

export default class UploadCode extends TaskBase {
  run(config:DeployConfig): Promise<any> {
    return this.upload(config)
    .then(() => {
      return this.deleteZipFile(config);
    });
  }

  private upload(config: DeployConfig): Promise<any> {
    let client = knox.createClient({
      key: config.accessKeyId,
      secret: config.secretAccessKey,
      bucket: config.bucket
    });

    let stats = fs.statSync(`${config.localPathBase}.zip`);
    let megaBytes = Math.round(stats.size / (1024 * 1024));
    console.log(`Uploading lambda code on ${config.bucket} to ${config.s3KeyForZip} (${megaBytes}MB)...`);
    let lastPercent;
    return new Promise((ok, fail) => {
      let req = client.putFile(`${config.localPathBase}.zip`, config.s3KeyForZip, function(err, res) {
        if (err) {
          return fail(err);
        }
        if (res) {
          res.resume();
        }
        ok();
      });
      req.on('progress', (data) => {
        if (data.percent !== lastPercent) {
          console.log(`Upload progress ${data.percent}%...`); 
          lastPercent = data.percent;
        }
      });
    });
  }

  private deleteZipFile(config:DeployConfig): Promise<any> {
    let zipPath = `${config.localPathBase}.zip`;
    return new Promise((ok, fail) => {
      fs.exists(zipPath, (exists) => {
        if (!exists) {
          return ok();
        }
        console.log(`Deleting zip file ${zipPath}...`);
        fs.unlink(zipPath, (err) => {
          if (err) {
            return fail(err);
          }
          ok();
        });
      });
    });
  }
}
