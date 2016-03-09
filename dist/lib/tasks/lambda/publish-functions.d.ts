import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';
export default class PublishFunctions extends TaskBase {
    run(config: DeployConfig): Promise<any>;
    private publish(config);
    private pointAlias(config, publishedVersions);
}
