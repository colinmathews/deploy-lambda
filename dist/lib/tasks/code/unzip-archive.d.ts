import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';
export default class UnzipArchive extends TaskBase {
    run(config: DeployConfig): Promise<any>;
    private unzip(config);
    private deleteZip(localPath);
    deleteUnzippedFolder(localPath: string): Promise<any>;
}
