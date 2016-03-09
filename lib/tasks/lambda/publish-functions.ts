import { Promise } from 'es6-promise';
import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';
let AWS = require('aws-sdk');
import { config as awsConfig, Credentials } from 'aws-sdk';

export default class PublishFunctions extends TaskBase {
  run(config:DeployConfig): Promise<any> {
    awsConfig.update({
      credentials: new Credentials(config.accessKeyId, config.secretAccessKey),
      region: config.region
    });

    return this.publish(config)
    .then((result:any[]) => {
      if (config.lambdaAlias) {
        return this.pointAlias(config, result);
      }
    });
  }

  private publish(config:DeployConfig): Promise<any> {
    let lambda = new AWS.Lambda();
    let promises = config.lambdaFunctionNames.map((name) => {
      return new Promise((ok, fail) => {
        console.log(`Updating lambda function "${name}"...`);
        lambda.updateFunctionCode({
          FunctionName: name,
          S3Bucket: config.bucket,
          S3Key: config.s3KeyForZip,
          Publish: true
        }, (err, result) => {
          if (err) {
            return fail(err);
          }
          ok(result);
        });
      });
    });
    return Promise.all(promises);
  }

  private pointAlias(config:DeployConfig, publishedVersions:any[]): Promise<any> {
    let lambda = new AWS.Lambda();
    let promises = publishedVersions.map((version) => {
      return new Promise((ok, fail) => {
        console.log(`Re-pointing lambda alias "${config.lambdaAlias}" for ${version.FunctionName}...`);
        lambda.updateAlias({
          FunctionName: version.FunctionName,
          Name: config.lambdaAlias,
          FunctionVersion: version.Version
        }, (err, result) => {
          if (err) {
            return fail(err);
          }
          ok(result);
        });
      });
    });
    return Promise.all(promises);
  }
}
