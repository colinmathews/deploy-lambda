require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs');
import { assert } from 'chai';
import DeployConfig from '../../lib/models/deploy-config';
import FinalizePackageFolder from '../../lib/tasks/code/finalize-package-folder';
import deleteFolder from '../../lib/util/delete-folder';
import prepare from '../prepare';

describe('Finalize package folder', () => {
  let subject: FinalizePackageFolder;
  let config: DeployConfig;

  beforeEach(function() {
    config = prepare();
    fs.mkdirSync(config.localPathBase);
    subject = new FinalizePackageFolder();
  });

  afterEach(function() {
    this.timeout(30000);
    return deleteFolder(config.localPathBase);
  });

  it('should copy all node_modules', function() {
    this.timeout(10000);
    return subject.run(config)
      .then(() => {
        let folderPath = `${config.localPathBase}`;
        assert.isTrue(fs.existsSync(folderPath));
        let files = fs.readdirSync(config.localPathBase);
        assert.isTrue(files.length > 0);
        let node_modules = files.filter((row) => {
          return row === 'node_modules';
        });
        assert.isTrue(node_modules.length === 1);
        files = fs.readdirSync(path.resolve(config.localPathBase, 'node_modules'));
        assert.isTrue(files.length > 0);
      });
  });
});
