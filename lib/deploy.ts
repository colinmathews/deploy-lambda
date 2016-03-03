import { Promise } from 'es6-promise';
import AWSConfig from './models/aws-config';
import DeployConfig from './models/deploy-config';
import TaskBase from './tasks/task-base';
import { config as awsConfig, Credentials } from 'aws-sdk';
import AWS = require('aws-sdk');
import Configure from './tasks/configure';
import CreateGitArchive from './tasks/create-git-archive';
import FinalizePackageFolder from './tasks/finalize-package-folder';
import UnzipArchive from './tasks/unzip-archive';
import ZipApplication from './tasks/zip-application';

export default class Deploy {
  constructor(_awsConfig:AWSConfig, public config:DeployConfig = new DeployConfig()) {
    awsConfig.update({
      credentials: new Credentials(_awsConfig.accessKeyId, _awsConfig.secretAccessKey),
      region: _awsConfig.region
    });
  }

  run(tasks?: TaskBase[]): Promise<any> {
    if (!tasks) {
      tasks = this.createPackageTasks().concat(this.uploadToLambdaTasks());
    }

    let current = tasks.shift();
    if (!current) {
      return Promise.resolve();
    }
    return current.run(this.config)
    .then(() => {
      return this.run(tasks);
    });
  }

  createPackageTasks(): TaskBase[] {
    return [
      new Configure(),
      new CreateGitArchive(),
      new UnzipArchive(),
      new FinalizePackageFolder(),
      new ZipApplication()
    ];
  }

  uploadToLambdaTasks(): TaskBase[] {
    return [];
  }
}
