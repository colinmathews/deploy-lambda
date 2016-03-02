require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs');
import { assert } from 'chai';
import DeployConfig from '../lib/models/deploy-config';
import CreateGitArchive from '../lib/tasks/create-git-archive';

describe('Create git archive', () => {
  let subject: CreateGitArchive;
  let config: DeployConfig;

  beforeEach(function() {
    let jsonPath = path.resolve(__dirname, '../../aws-config.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error("Please create a 'aws-config.json' file in the root directory of this project to test with AWS resources")
    }

    let rawConfig = JSON.parse(fs.readFileSync(jsonPath));
    config = new DeployConfig(rawConfig);
    config.uniqueID = new Date().valueOf().toString();
    config.localPathBase = path.resolve(__dirname, '../../test-run-directory');
    subject = new CreateGitArchive();
  });

  afterEach(function() {
    this.timeout(10000);
    let zipPath = `${config.localPathBase}.zip`;
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
  });

  it('should create the archive', function() {
    this.timeout(5000);
    return subject.run(config)
    .then(() => {
      let zipPath = `${config.localPathBase}.zip`;
      assert.isTrue(fs.existsSync(zipPath));
      let stats = fs.statSync(zipPath);
      assert.isTrue(stats.size > 0);
    });
  });
});
