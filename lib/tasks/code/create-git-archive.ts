import { Promise } from 'es6-promise';
import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';

export default class CreateGitArchive extends TaskBase {
  run(config: DeployConfig): Promise<any> {
    return this.execute(`git archive HEAD --format=zip > ${config.localPathBase}.zip`);
  }
}
