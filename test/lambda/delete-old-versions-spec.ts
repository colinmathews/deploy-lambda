require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs');
import { assert } from 'chai';
import DeployConfig from '../../lib/models/deploy-config';
import DeleteOldVersions from '../../lib/tasks/lambda/delete-old-versions';
import prepare from '../prepare';

describe('Delete old versions', () => {
  let config: DeployConfig;
  let subject: DeleteOldVersions;

  beforeEach(function() {
    let preparation = prepare();
    config = <DeployConfig>preparation.config;
    subject = new DeleteOldVersions();
  });

  it('should list old versions to delete', function() {
    this.timeout(8000);
    return subject.getVersionInfoByFunction(config)
    .then((result) => {
      return subject.getUnboundVersionsToDelete(result, config);
    })
    .then((result) => {
      // Nothing easy to test here
      console.log(JSON.stringify(result, null, 2));
    });
  });

  it('should delete old versions', function() {
    this.timeout(8000);
    return subject.run(config)
    .then((result) => {
      // Nothing easy to test here
      console.log(JSON.stringify(result, null, 2));
    });
  });
});
