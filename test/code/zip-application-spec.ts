require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs');
import { assert } from 'chai';
import DeployConfig from '../../lib/models/deploy-config';
import ZipApplication from '../../lib/tasks/code/zip-application';
import deleteFolder from '../../lib/util/delete-folder';

describe('Zip application', () => {
  let subject: ZipApplication;
  let config: DeployConfig;
  let testFileName: string = new Date().toString() + '.txt';
  let fileContents = 'hi';

  beforeEach(function() {
    let jsonPath = path.resolve(__dirname, '../../../aws-config.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error("Please create a 'aws-config.json' file in the root directory of this project to test with AWS resources")
    }

    let rawConfig = JSON.parse(fs.readFileSync(jsonPath));
    config = new DeployConfig(rawConfig);
    config.uniqueID = new Date().valueOf().toString();
    config.localPathBase = path.resolve(__dirname, '../../../test-run-directory');
    subject = new ZipApplication();

    if (!fs.existsSync(config.localPathBase)) {
      fs.mkdirSync(config.localPathBase);
    }
    fs.writeFileSync(path.resolve(config.localPathBase, testFileName), fileContents);
  });

  afterEach(function() {
    this.timeout(10000);
    let zipPath = `${config.localPathBase}.zip`;
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    return deleteFolder(config.localPathBase);
  });

  it('should zip the application', function() {
    this.timeout(5000);
    return subject.run(config)
    .then(() => {
      let folderPath = `${config.localPathBase}`;
      assert.isFalse(fs.existsSync(folderPath));
      let zipPath = `${config.localPathBase}.zip`;
      assert.isTrue(fs.existsSync(zipPath));
    });
  });
});
