require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs');
import { assert } from 'chai';
import DeployConfig from '../../lib/models/deploy-config';
import Permissions from '../../lib/permissions';
import Configure from '../../lib/tasks/code/configure';
import PublishFunctions from '../../lib/tasks/lambda/publish-functions';
import Deploy from '../../lib/deploy';
import prepare from '../prepare';

describe('Run a real lambda deploy: ', () => {
  let config: DeployConfig;
  let testConfig;

  beforeEach(function() {
    let preparation = prepare();
    config = <DeployConfig>preparation.config;
    testConfig = preparation.rawConfig;
  });

  describe('Permissions', () => {
    let subject: Permissions;

    beforeEach(function() {
      subject = new Permissions(config);
    });

    it('should grant necessary permissions', function() {
      if (!testConfig.permissions) {
        return this.skip();
      }
      this.timeout(8000);
      return subject.grant()
      .then((result) => {
        // Nothing easy to test here
        console.log(JSON.stringify(result, null, 2));
      });
    });
  });

  describe('Full publish', () => {
    let subject: Deploy;

    beforeEach(function() {
      subject = new Deploy(config);
    });

    it('should deploy the last commit as a new version of function', function() {
      if (!testConfig.publishThisRepo || testConfig.publishThisRepo.existingS3KeyForZip) {
        return this.skip();
      }
      this.timeout(10 * 60 * 1000);
      return subject.run();
    });
  });

  describe('Publish an existing package', () => {
    let subject: Deploy;

    beforeEach(function() {
      let copyConfig = new DeployConfig(config);
      if (testConfig.publishThisRepo && testConfig.publishThisRepo.existingS3KeyForZip) {
        copyConfig.s3KeyForZip = testConfig.publishThisRepo.existingS3KeyForZip; 
      }
      subject = new Deploy(copyConfig);
    });

    it('should publish an already packaged zip', function() {
      let tasks = [
        new Configure(),
        new PublishFunctions()];
      if (!testConfig.publishThisRepo || !testConfig.publishThisRepo.existingS3KeyForZip) {
        return this.skip();
      }
      this.timeout(1 * 60 * 1000);
      return subject.run(tasks);
    });
  });
});
