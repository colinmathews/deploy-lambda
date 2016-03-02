import { Promise } from 'es6-promise';
import DeployConfig from '../models/deploy-config';
import TaskBase from './task-base';
import fs = require('fs');
let unzip = require('unzip');

export default class CopyNodeModules extends TaskBase {
  run(config: DeployConfig): Promise<any> {
    return this.execute(`cp -r ${this.rootPath()}/node_modules ${config.localPathBase}/node_modules`);
  }
}
