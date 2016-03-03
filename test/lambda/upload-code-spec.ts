require('source-map-support').install({
  handleUncaughtExceptions: false
});
let path = require('path');
let fs = require('fs');
import { assert } from 'chai';
import DeployConfig from '../../lib/models/deploy-config';
import Configure from '../../lib/tasks/code/configure';
import CreateGitArchive from '../../lib/tasks/code/create-git-archive';
import UploadCode from '../../lib/tasks/lambda/upload-code';
import { S3, Credentials } from 'aws-sdk';

describe('Upload code', () => {
  let subject: UploadCode;
  let config: DeployConfig;
  let s3;

  function createS3(config:DeployConfig) {
    s3 = new S3({
      credentials: new Credentials(config.accessKeyId, config.secretAccessKey),
      region: config.region,
      bucket: config.bucket
    });
  }

  function deleteS3Key(key:string): Promise<any> {
    return new Promise((ok, fail) => {
      let args = {
        Bucket: config.bucket,
        Key: key
      };
      (<any>s3).deleteObject(args, (err, data) => {
        if (err) {
          return fail(err);
        }
        ok();
      });
    });
  }

  function getS3Meta(config: DeployConfig, key:string): Promise<any> {
    return new Promise((ok, fail) => {
      let args = {
        Bucket: config.bucket,
        Key: decodeURIComponent(key.replace(/\+/g, " "))
      };
      s3.headObject(args, (err, data) => {
        if (err) {
          if (err.code === 'AccessDenied') {
            return ok(null);
          }
          return fail(err);
        }
        ok(data);
      });
    });
  }

  beforeEach(function() {
    let jsonPath = path.resolve(__dirname, '../../../aws-config.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error("Please create a 'aws-config.json' file in the root directory of this project to test with AWS resources")
    }

    let rawConfig = JSON.parse(fs.readFileSync(jsonPath));
    config = new DeployConfig(rawConfig);
    config.uniqueID = new Date().valueOf().toString();
    config.localPathBase = path.resolve(__dirname, '../../../test-run-directory');
    subject = new UploadCode();

    createS3(config);
    return new Configure().run(config)
    .then(() => new CreateGitArchive().run(config));
  });

  afterEach(function() {
    this.timeout(10000);
    let zipPath = `${config.localPathBase}.zip`;
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    return deleteS3Key(config.s3KeyForZip);
  });

  it('should send zip file to S3', function() {
    this.timeout(5000);
    return subject.run(config)
      .then(() => {
        return getS3Meta(config, config.s3KeyForZip);
      })
      .then((meta) => {
        assert.isNotNull(meta);
      });
  });
});
