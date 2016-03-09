import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';
export default class UploadCode extends TaskBase {
    run(config: DeployConfig): Promise<any>;
    private upload(config);
    private deleteZipFile(config);
}
