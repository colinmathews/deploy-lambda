"use strict";
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var path = require('path');
var fs = require('fs');
var deploy_config_1 = require('../../lib/models/deploy-config');
var permissions_1 = require('../../lib/permissions');
var configure_1 = require('../../lib/tasks/code/configure');
var publish_functions_1 = require('../../lib/tasks/lambda/publish-functions');
var deploy_1 = require('../../lib/deploy');
var prepare_1 = require('../prepare');
describe('Run a real lambda deploy: ', function () {
    var config;
    var rawConfig;
    beforeEach(function () {
        var preparation = prepare_1.default();
        config = preparation.config;
        rawConfig = preparation.rawConfig;
    });
    describe('Permissions', function () {
        var subject;
        beforeEach(function () {
            subject = new permissions_1.default(config);
        });
        it('should grant necessary permissions', function () {
            if (!rawConfig.testPermissions) {
                return this.skip();
            }
            this.timeout(8000);
            return subject.grant()
                .then(function (result) {
                // Nothing easy to test here
                console.log(JSON.stringify(result, null, 2));
            });
        });
    });
    describe('Full publish', function () {
        var subject;
        beforeEach(function () {
            subject = new deploy_1.default(config);
        });
        it('should deploy the last commit as a new version of function', function () {
            if (!rawConfig.testPublishThisRepo || rawConfig.testPublishThisRepo.existingS3KeyForZip) {
                return this.skip();
            }
            this.timeout(10 * 60 * 1000);
            return subject.run();
        });
    });
    describe('Publish an existing package', function () {
        var subject;
        beforeEach(function () {
            var copyConfig = new deploy_config_1.default(config);
            if (rawConfig.testPublishThisRepo && rawConfig.testPublishThisRepo.existingS3KeyForZip) {
                copyConfig.s3KeyForZip = rawConfig.testPublishThisRepo.existingS3KeyForZip;
            }
            subject = new deploy_1.default(copyConfig);
        });
        it('should publish an already packaged zip', function () {
            var tasks = [
                new configure_1.default(),
                new publish_functions_1.default()];
            if (!rawConfig.testPublishThisRepo || !rawConfig.testPublishThisRepo.existingS3KeyForZip) {
                return this.skip();
            }
            this.timeout(1 * 60 * 1000);
            return subject.run(tasks);
        });
    });
});
//# sourceMappingURL=deploy-spec.js.map