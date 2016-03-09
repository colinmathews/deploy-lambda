import DeployConfig from './models/deploy-config';
import TaskBase from './tasks/task-base';
export default class Deploy {
    config: DeployConfig;
    constructor(config?: DeployConfig);
    run(tasks?: TaskBase[]): Promise<any>;
    createPackageTasks(): TaskBase[];
    uploadToLambdaTasks(): TaskBase[];
}
