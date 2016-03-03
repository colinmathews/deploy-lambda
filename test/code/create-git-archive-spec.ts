require('source-map-support').install({
  handleUncaughtExceptions: false
});
let fs = require('fs');
import { assert } from 'chai';
import DeployConfig from '../../lib/models/deploy-config';
import CreateGitArchive from '../../lib/tasks/code/create-git-archive';
import prepare from '../prepare';

describe('Create git archive', () => {
  let subject: CreateGitArchive;
  let config: DeployConfig;

  beforeEach(function() {
    config = prepare();
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
