import { Promise } from 'es6-promise';
import DeployConfig from './models/deploy-config';
import { config as awsConfig, Credentials } from 'aws-sdk';
import AWS = require('aws-sdk');

export default class Permissions {
  constructor(public config:DeployConfig) {
    awsConfig.update({
      credentials: new Credentials(config.accessKeyId, config.secretAccessKey),
      region: config.region
    });
  }

  // TODO:
}
