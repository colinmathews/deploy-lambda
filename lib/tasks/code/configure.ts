require('date-format-lite');
import { Promise } from 'es6-promise';
import DeployConfig from '../../models/deploy-config';
import TaskBase from '../task-base';

function parseCommitFromGitLog(log:string):string {
  return log.replace('commit ', '').substring(0, 7);
}

export default class Configure extends TaskBase {
  run(config: DeployConfig): Promise<any> {
    return Promise.resolve()
    .then(() => {
      if (!config.uniqueID) {
        return this.execute('git log -1');
      }
    })
    .then((result) => {
      if (!config.uniqueID) {
        let commit = parseCommitFromGitLog(result);
        config.uniqueID = `deploy-${config.targetEnvironment}-${commit}`; 
      }
      config.localPathBase = config.localPathBase || `${this.rootPath()}/${config.uniqueID }`;

      // Remove last slash so this is normalized
      config.s3KeyBase = config.s3KeyBase.replace(/\/?$/gi, '');
      config.s3KeyForZip = config.s3KeyForZip || `${config.s3KeyBase}/${config.uniqueID}.zip`;
    });
  }
}
