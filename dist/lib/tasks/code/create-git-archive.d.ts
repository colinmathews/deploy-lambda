import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';
export default class CreateGitArchive extends TaskBase {
    run(config: DeployConfig): Promise<any>;
}
