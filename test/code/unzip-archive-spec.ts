require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs');
import { assert } from 'chai';
import DeployConfig from '../../lib/models/deploy-config';
import CreateGitArchive from '../../lib/tasks/code/create-git-archive';
import UnzipArchive from '../../lib/tasks/code/unzip-archive';
import prepare from '../prepare';

describe('Unzip git archive', () => {
  let subject: UnzipArchive;
  let config: DeployConfig;

  beforeEach(function() {
    config = prepare().config;
    subject = new UnzipArchive();

    return new CreateGitArchive().run(config);
  });

  afterEach(function() {
    this.timeout(10000);
    let zipPath = `${config.localPathBase}.zip`;
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    return subject.deleteUnzippedFolder(config.localPathBase);
  });

  it('should unzip the archive', function() {
    this.timeout(5000);
    return subject.run(config)
    .then(() => {
      let folderPath = `${config.localPathBase}`;
      assert.isTrue(fs.existsSync(folderPath));
      let files = fs.readdirSync(config.localPathBase);
      assert.isTrue(files.length > 0);
      let node_modules = files.filter((row) => {
        return row === 'node_modules';
      });
      assert.isTrue(node_modules.length === 0);
    });
  });
});
