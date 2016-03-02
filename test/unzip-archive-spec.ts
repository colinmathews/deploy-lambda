require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs');
import { assert } from 'chai';
import DeployConfig from '../lib/models/deploy-config';
import CreateGitArchive from '../lib/tasks/create-git-archive';
import UnzipArchive from '../lib/tasks/unzip-archive';

describe('Unzip git archive', () => {
  let subject: UnzipArchive;
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
