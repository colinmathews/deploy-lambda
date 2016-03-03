import { Promise } from 'es6-promise';
import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';
let knox = require('knox');
let AWS = require('aws-sdk');

export default class UploadCode extends TaskBase {
  run(config:DeployConfig): Promise<any> {
    return this.upload(config);
  }

  private upload(config:DeployConfig): Promise<any> {
    let client = knox.createClient({
      key: config.accessKeyId,
      secret: config.secretAccessKey,
      bucket: config.bucket
    });

    console.log(`Uploading lambda code on ${config.bucket} to ${config.s3KeyForZip}...`);
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
}
