require('source-map-support').install({
  handleUncaughtExceptions: false
});
import { assert } from 'chai';
import DeployConfig from '../../lib/models/deploy-config';
import Configure from '../../lib/tasks/code/configure';
import prepare from '../prepare';

describe('Create git archive', () => {
  let subject: Configure;
  let config: DeployConfig;

  beforeEach(function() {
    subject = new Configure();
  });

  it('should fill the config with values', function() {
    this.timeout(5000);
    config = new DeployConfig();
    config.s3KeyBase = 'test-s3-dir/'

    return subject.run(config)
    .then(() => {
      assert.isNotNull(config.uniqueID);
      assert.isNotNull(config.localPathBase);
      assert.isTrue(config.localPathBase.indexOf(config.uniqueID) === config.localPathBase.length - config.uniqueID.length);
      assert.isNotNull(config.s3KeyBase);
      assert.isNotNull(config.s3KeyForZip);
      assert.isTrue(config.s3KeyForZip.indexOf('.zip') > 0 && config.s3KeyForZip.indexOf(config.s3KeyBase) === 0);
    });
  });
});
