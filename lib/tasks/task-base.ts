import { Promise } from 'es6-promise';
import DeployConfig from '../models/deploy-config';
import execute from '../util/execute';
import path = require('path');

// TODO: This should be an abstract class, but tsc isn't liking that
class TaskBase {

  // TODO: This should be an abstract method
  run(config: DeployConfig): Promise<any> {
    throw new Error('Subclasses of TaskBase must override this method');
  }

  protected rootPath(): string {
    let root = path.resolve();
    return root.replace(/\/?$/gi, '');
  }

  protected execute(command:string): Promise<any> {
    console.log(`Executing ${command}`);
    return execute(command);
  }
}

export default TaskBase
