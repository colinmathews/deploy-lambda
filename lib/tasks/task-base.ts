import { Promise } from 'es6-promise';
import DeployConfig from '../models/deploy-config';
import execute from '../util/execute';
import path = require('path');

abstract class TaskBase {
  abstract run(config: DeployConfig): Promise<any>;

  protected rootPath(): string {
    let root = path.resolve(__dirname, '../../../');
    return root.replace(/\/?$/gi, '');
  }

  protected execute(command:string): Promise<any> {
    console.log(`Executing ${command}`);
    return execute(command);
  }
}

export default TaskBase
