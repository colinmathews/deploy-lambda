import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';
export default class DeleteOldVersions extends TaskBase {
    private hasConfiguredAWS;
    run(config: DeployConfig): Promise<any>;
    getUnboundVersionsToDelete(versionInfo: any, config: DeployConfig): any[];
    getVersionInfoByFunction(config: DeployConfig): Promise<any>;
    deleteVersions(versions: any[], config?: DeployConfig): Promise<any>;
    private configureAWS(config);
    private listVersions(config);
    private listAliases(config);
    private getUnboundVersionsForFunction(versions, aliases);
}
