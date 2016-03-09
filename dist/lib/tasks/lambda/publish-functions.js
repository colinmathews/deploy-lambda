"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var es6_promise_1 = require('es6-promise');
var task_base_1 = require('../task-base');
var AWS = require('aws-sdk');
var aws_sdk_1 = require('aws-sdk');
var PublishFunctions = (function (_super) {
    __extends(PublishFunctions, _super);
    function PublishFunctions() {
        _super.apply(this, arguments);
    }
    PublishFunctions.prototype.run = function (config) {
        var _this = this;
        aws_sdk_1.config.update({
            credentials: new aws_sdk_1.Credentials(config.accessKeyId, config.secretAccessKey),
            region: config.region
        });
        return this.publish(config)
            .then(function (result) {
            if (config.lambdaAlias) {
                return _this.pointAlias(config, result);
            }
        });
    };
    PublishFunctions.prototype.publish = function (config) {
        var lambda = new AWS.Lambda();
        var promises = config.lambdaFunctionNames.map(function (name) {
            return new es6_promise_1.Promise(function (ok, fail) {
                console.log("Updating lambda function \"" + name + "\"...");
                lambda.updateFunctionCode({
                    FunctionName: name,
                    S3Bucket: config.bucket,
                    S3Key: config.s3KeyForZip,
                    Publish: true
                }, function (err, result) {
                    if (err) {
                        return fail(err);
                    }
                    ok(result);
                });
            });
        });
        return es6_promise_1.Promise.all(promises);
    };
    PublishFunctions.prototype.pointAlias = function (config, publishedVersions) {
        var lambda = new AWS.Lambda();
        var promises = publishedVersions.map(function (version) {
            return new es6_promise_1.Promise(function (ok, fail) {
                console.log("Re-pointing lambda alias \"" + config.lambdaAlias + "\" for " + version.FunctionName + "...");
                lambda.updateAlias({
                    FunctionName: version.FunctionName,
                    Name: config.lambdaAlias,
                    FunctionVersion: version.Version
                }, function (err, result) {
                    if (err) {
                        return fail(err);
                    }
                    ok(result);
                });
            });
        });
        return es6_promise_1.Promise.all(promises);
    };
    return PublishFunctions;
}(task_base_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PublishFunctions;
//# sourceMappingURL=publish-functions.js.map