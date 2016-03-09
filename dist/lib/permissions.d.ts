import DeployConfig from './models/deploy-config';
export default class Permissions {
    config: DeployConfig;
    constructor(config: DeployConfig);
    listDeployPermissions(): string[];
    grant(...permissions: string[]): Promise<any>;
    grantPermission(principal: string, functionName: string, permission: string): Promise<any>;
}
