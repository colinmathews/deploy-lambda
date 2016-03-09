"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var es6_promise_1 = require('es6-promise');
var task_base_1 = require('../task-base');
var fs = require('fs');
var knox = require('knox');
var AWS = require('aws-sdk');
var UploadCode = (function (_super) {
    __extends(UploadCode, _super);
    function UploadCode() {
        _super.apply(this, arguments);
    }
    UploadCode.prototype.run = function (config) {
        var _this = this;
        return this.upload(config)
            .then(function () {
            return _this.deleteZipFile(config);
        });
    };
    UploadCode.prototype.upload = function (config) {
        var client = knox.createClient({
            key: config.accessKeyId,
            secret: config.secretAccessKey,
            bucket: config.bucket
        });
        var stats = fs.statSync(config.localPathBase + ".zip");
        var megaBytes = Math.round(stats.size / (1024 * 1024));
        console.log("Uploading lambda code on " + config.bucket + " to " + config.s3KeyForZip + " (" + megaBytes + "MB)...");
        var lastPercent;
        return new es6_promise_1.Promise(function (ok, fail) {
            var req = client.putFile(config.localPathBase + ".zip", config.s3KeyForZip, function (err, res) {
                if (err) {
                    return fail(err);
                }
                if (res) {
                    res.resume();
                }
                ok();
            });
            req.on('progress', function (data) {
                if (data.percent !== lastPercent) {
                    console.log("Upload progress " + data.percent + "%...");
                    lastPercent = data.percent;
                }
            });
        });
    };
    UploadCode.prototype.deleteZipFile = function (config) {
        var zipPath = config.localPathBase + ".zip";
        return new es6_promise_1.Promise(function (ok, fail) {
            fs.exists(zipPath, function (exists) {
                if (!exists) {
                    return ok();
                }
                console.log("Deleting zip file " + zipPath + "...");
                fs.unlink(zipPath, function (err) {
                    if (err) {
                        return fail(err);
                    }
                    ok();
                });
            });
        });
    };
    return UploadCode;
}(task_base_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UploadCode;
//# sourceMappingURL=upload-code.js.map