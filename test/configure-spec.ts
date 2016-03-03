require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs');
import { assert } from 'chai';
import DeployConfig from '../lib/models/deploy-config';
import Configure from '../lib/tasks/configure';

describe('Create git archive', () => {
  let subject: Configure;
  let config: DeployConfig;

  beforeEach(function() {
    let jsonPath = path.resolve(__dirname, '../../aws-config.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error("Please create a 'aws-config.json' file in the root directory of this project to test with AWS resources")
    }

    let rawConfig = JSON.parse(fs.readFileSync(jsonPath));
    config = new DeployConfig(rawConfig);
    config.targetEnvironment = 'test';
    config.s3KeyBase = 'test-s3-dir/'
    subject = new Configure();
  });

  it('should fill the config with values', function() {
    this.timeout(5000);
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
