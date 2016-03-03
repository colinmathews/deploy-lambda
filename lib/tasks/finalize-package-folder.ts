import { Promise } from 'es6-promise';
import DeployConfig from '../models/deploy-config';
import TaskBase from './task-base';
import deleteFolder from '../util/delete-folder';

export default class FinalizePackageFolder extends TaskBase {
  run(config: DeployConfig): Promise<any> {
    let includes = (config.extraPathsToInclude || []);
    let excludes = (config.extraPathsToExclude || []);
    includes.push('node_modules');

    return this.addPaths(includes, config)
    .then(() => this.removePaths(excludes, config));
  }

  private addPaths(paths: string[], config: DeployConfig): Promise<any> {
    let promises = paths.map((include) => {
      return this.execute(`cp -r ${this.rootPath()}/${include} ${config.localPathBase}/${include}`);
    });
    return Promise.all(promises);
  }

  private removePaths(paths: string[], config: DeployConfig): Promise<any> {
    let promises = paths.map((exclude) => {
      return deleteFolder(`${config.localPathBase}/${exclude}`);
    });
    return Promise.all(promises);
  }
}
