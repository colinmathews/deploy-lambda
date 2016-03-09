import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';
export default class FinalizePackageFolder extends TaskBase {
    run(config: DeployConfig): Promise<any>;
    private addPaths(paths, config);
    private removePaths(paths, config);
}
