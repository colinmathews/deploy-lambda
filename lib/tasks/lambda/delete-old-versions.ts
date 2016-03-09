import { Promise } from 'es6-promise';
import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';
let AWS = require('aws-sdk');
import { config as awsConfig, Credentials } from 'aws-sdk';

export default class DeleteOldVersions extends TaskBase {
  private hasConfiguredAWS: boolean;

  run(config: DeployConfig): Promise<any> {
    this.configureAWS(config);
    if (!config.maxUnboundVersionsToKeep) {
      return Promise.resolve();
    }

    return this.getVersionInfoByFunction(config)
    .then((result) => {
      return this.getUnboundVersionsToDelete(result, config);
    })
    .then((result:any[]) => {
      return this.deleteVersions(result);
    });
  }

  getUnboundVersionsToDelete(versionInfo: any, config:DeployConfig): any[] {
    if (!config.maxUnboundVersionsToKeep) {
      return [];
    }
    this.configureAWS(config);
    return Object.keys(versionInfo).reduce((final, key) => {
      let info = versionInfo[key];
      let toDelete = this.getUnboundVersionsForFunction(info.versions, info.aliases)
        .slice(0, config.maxUnboundVersionsToKeep);
      return final.concat(toDelete);
    }, []);
  }

  getVersionInfoByFunction(config: DeployConfig): Promise<any> {
    this.configureAWS(config);
    let versionInfo;
    return this.listVersions(config)
    .then((result) => {
      versionInfo = result.reduce((final, row) => {
        final[row.functionName] = {
          versions: row.versions
        };
        return final;
      }, {});
      return this.listAliases(config);
    })
    .then((result) => {
      versionInfo = result.reduce((final, row) => {
        final[row.functionName].aliases = row.aliases;
        return final;
      }, versionInfo);
      return versionInfo;
    });
  }

  deleteVersions(versions: any[], config?:DeployConfig): Promise<any> {
    if (config) {
      this.configureAWS(config); 
    }
    let lambda = new AWS.Lambda();
    let promises = versions.map((version) => {
      return new Promise((ok, fail) => {
        console.log(`Deleting version ${version.Version} of lambda function "${version.FunctionName}"...`);
        lambda.deleteFunction({
          FunctionName: version.FunctionName,
          Qualifier: version.Version
        }, (err, result) => {
          if (err) {
            return fail(err);
          }
          ok(result);
        });
      });
    });
    return Promise.all(promises);
  }

  private configureAWS(config:DeployConfig) {
    if (this.hasConfiguredAWS) {
      return;
    }
    this.hasConfiguredAWS = true;
    awsConfig.update({
      credentials: new Credentials(config.accessKeyId, config.secretAccessKey),
      region: config.region
    });
  }

  private listVersions(config: DeployConfig): Promise<any> {
    let lambda = new AWS.Lambda();
    let promises = config.lambdaFunctionNames.map((name) => {
      return new Promise((ok, fail) => {
        console.log(`Getting versions for function "${name}"...`);
        lambda.listVersionsByFunction({
          FunctionName: name
        }, (err, result) => {
          if (err) {
            return fail(err);
          }
          ok({
            functionName: name,
            versions: result.Versions
          });
        });
      });
    });
    return Promise.all(promises);
  }

  private listAliases(config: DeployConfig): Promise<any> {
    let lambda = new AWS.Lambda();
    let promises = config.lambdaFunctionNames.map((name) => {
      return new Promise((ok, fail) => {
        console.log(`Getting aliases for function "${name}"...`);
        lambda.listAliases({
          FunctionName: name
        }, (err, result) => {
          if (err) {
            return fail(err);
          }
          ok({
            functionName: name,
            aliases: result.Aliases
          });
        });
      });
    });
    return Promise.all(promises);
  }

  private getUnboundVersionsForFunction(versions: any[], aliases: any[]): any[] {
    let unbound = versions.filter((version) => {
      if (version.Version === '$LATEST') {
        return false;
      }
      let found = aliases.filter((alias) => {
        return alias.FunctionVersion === version.Version;
      });
      return found.length === 0;
    });

    unbound.sort((a, b) => {
      if (a.LastModififed < b.LastModified) {
        return -1;
      }
      if (a.LastModififed > b.LastModified) {
        return 1;
      }
      return 0;
    });

    return unbound;
  }
}
