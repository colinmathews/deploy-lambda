require('date-format-lite');
import { Promise } from 'es6-promise';
import DeployConfig from '../models/deploy-config';
import TaskBase from './task-base';

function parseCommitFromGitLog(log:string):string {
  return log.replace('commit ', '').substring(0, 7);
}

export default class Configure extends TaskBase {
  run(config: DeployConfig): Promise<any> {
    return this.execute('git log -1')
    .then((result) => {
      let commit = parseCommitFromGitLog(result);
      config.uniqueID = config.uniqueID || `deploy-${config.targetEnvironment}-${commit}`;
      config.localPathBase = config.localPathBase || `${this.rootPath()}/${config.uniqueID }`;

      let baseKey = config.s3KeyBase.replace(/\/?$/gi, '');
      let now = <any>new Date();
      config.s3KeyForZip = config.s3KeyForZip || `${baseKey}/${now.format('MMMM-DD-YYYY')}.zip`;
    });
  }
}
