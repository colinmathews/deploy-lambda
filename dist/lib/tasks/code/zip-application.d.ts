import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';
export default class ZipApplication extends TaskBase {
    run(config: DeployConfig): Promise<any>;
    private zipFolder(zip, config);
    private writeZip(zip, config);
}
