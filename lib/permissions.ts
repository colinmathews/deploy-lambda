import { Promise } from 'es6-promise';
import DeployConfig from './models/deploy-config';
import { config as awsConfig, Credentials } from 'aws-sdk';
let AWS = require('aws-sdk');
let uuid = require('node-uuid');

export default class Permissions {
  constructor(public config:DeployConfig) {
    awsConfig.update({
      credentials: new Credentials(config.accessKeyId, config.secretAccessKey),
      region: config.region
    });
  }

  listDeployPermissions():string[] {
    return ['lambda:ListAliases', 'lambda:ListVersionsByFunction', 'lambda:UpdateAlias', 'lambda:DeleteFunction'];
  }

  grant(...permissions: string[]): Promise<any> {
    if (permissions.length === 0) {
      permissions = this.listDeployPermissions();
    }
    let promises = this.config.lambdaFunctionNames.reduce((result, functionName) => {
      let add = permissions.map((permission) => {
        return this.grantPermission(this.config.awsPrincipal, functionName, permission);
      });
      return result.concat(add);
    }, []);
    return Promise.all(promises);
  }

  grantPermission(principal: string, functionName: string, permission: string): Promise<any> {
    let lambda = new AWS.Lambda();
    return new Promise((ok, fail) => {
      console.log(`Granting ${permission} to ${principal} on ${functionName}...`);
      lambda.addPermission({
        FunctionName: functionName,
        Action: permission,
        Principal: principal,
        StatementId: uuid.v4().replace(/-/g, '')
      }, (err, result) => {
        if (err) {
          return fail(err);
        }
        ok(result);
      });
    });
  }
}
