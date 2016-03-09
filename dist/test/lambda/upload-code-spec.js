"use strict";
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var path = require('path');
var fs = require('fs');
var chai_1 = require('chai');
var configure_1 = require('../../lib/tasks/code/configure');
var create_git_archive_1 = require('../../lib/tasks/code/create-git-archive');
var upload_code_1 = require('../../lib/tasks/lambda/upload-code');
var aws_sdk_1 = require('aws-sdk');
var prepare_1 = require('../prepare');
describe('Upload code', function () {
    var subject;
    var config;
    var s3;
    function createS3(config) {
        s3 = new aws_sdk_1.S3({
            credentials: new aws_sdk_1.Credentials(config.accessKeyId, config.secretAccessKey),
            region: config.region,
            bucket: config.bucket
        });
    }
    function deleteS3Key(key) {
        return new Promise(function (ok, fail) {
            var args = {
                Bucket: config.bucket,
                Key: key
            };
            s3.deleteObject(args, function (err, data) {
                if (err) {
                    return fail(err);
                }
                ok();
            });
        });
    }
    function getS3Meta(config, key) {
        return new Promise(function (ok, fail) {
            var args = {
                Bucket: config.bucket,
                Key: decodeURIComponent(key.replace(/\+/g, " "))
            };
            s3.headObject(args, function (err, data) {
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
    beforeEach(function () {
        config = prepare_1.default().config;
        subject = new upload_code_1.default();
        createS3(config);
        return new configure_1.default().run(config)
            .then(function () { return new create_git_archive_1.default().run(config); });
    });
    afterEach(function () {
        this.timeout(10000);
        var zipPath = config.localPathBase + ".zip";
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }
        return deleteS3Key(config.s3KeyForZip);
    });
    it('should send zip file to S3', function () {
        this.timeout(5000);
        return subject.run(config)
            .then(function () {
            return getS3Meta(config, config.s3KeyForZip);
        })
            .then(function (meta) {
            chai_1.assert.isNotNull(meta);
        });
    });
});
//# sourceMappingURL=upload-code-spec.js.map