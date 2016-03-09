"use strict";
var es6_promise_1 = require('es6-promise');
var deploy_config_1 = require('./models/deploy-config');
var aws_sdk_1 = require('aws-sdk');
var configure_1 = require('./tasks/code/configure');
var create_git_archive_1 = require('./tasks/code/create-git-archive');
var finalize_package_folder_1 = require('./tasks/code/finalize-package-folder');
var unzip_archive_1 = require('./tasks/code/unzip-archive');
var zip_application_1 = require('./tasks/code/zip-application');
var upload_code_1 = require('./tasks/lambda/upload-code');
var publish_functions_1 = require('./tasks/lambda/publish-functions');
var delete_old_versions_1 = require('./tasks/lambda/delete-old-versions');
var Deploy = (function () {
    function Deploy(config) {
        if (config === void 0) { config = new deploy_config_1.default(); }
        this.config = config;
        aws_sdk_1.config.update({
            credentials: new aws_sdk_1.Credentials(config.accessKeyId, config.secretAccessKey),
            region: config.region
        });
    }
    Deploy.prototype.run = function (tasks) {
        var _this = this;
        if (!tasks) {
            tasks = this.createPackageTasks().concat(this.uploadToLambdaTasks());
        }
        var current = tasks.shift();
        if (!current) {
            return es6_promise_1.Promise.resolve();
        }
        return current.run(this.config)
            .then(function () {
            return _this.run(tasks);
        });
    };
    Deploy.prototype.createPackageTasks = function () {
        return [
            new configure_1.default(),
            new create_git_archive_1.default(),
            new unzip_archive_1.default(),
            new finalize_package_folder_1.default(),
            new zip_application_1.default()
        ];
    };
    Deploy.prototype.uploadToLambdaTasks = function () {
        return [
            new upload_code_1.default(),
            new publish_functions_1.default(),
            new delete_old_versions_1.default()
        ];
    };
    return Deploy;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Deploy;
//# sourceMappingURL=deploy.js.map