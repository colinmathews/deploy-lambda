import { Promise } from 'es6-promise';
import DeployConfig from './models/deploy-config';
import TaskBase from './tasks/task-base';
import { config as awsConfig, Credentials } from 'aws-sdk';
import AWS = require('aws-sdk');
import Configure from './tasks/code/configure';
import CreateGitArchive from './tasks/code/create-git-archive';
import FinalizePackageFolder from './tasks/code/finalize-package-folder';
import UnzipArchive from './tasks/code/unzip-archive';
import ZipApplication from './tasks/code/zip-application';

export default class Deploy {
  constructor(public config:DeployConfig = new DeployConfig()) {
    awsConfig.update({
      credentials: new Credentials(config.accessKeyId, config.secretAccessKey),
      region: config.region
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
