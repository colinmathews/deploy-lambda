import DeployConfig from '../models/deploy-config';
declare class TaskBase {
    run(config: DeployConfig): Promise<any>;
    protected rootPath(): string;
    protected execute(command: string): Promise<any>;
}
export default TaskBase;
