"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var es6_promise_1 = require('es6-promise');
var task_base_1 = require('../task-base');
var fs = require('fs');
var delete_folder_1 = require('../../util/delete-folder');
var unzip = require('unzip');
var UnzipArchive = (function (_super) {
    __extends(UnzipArchive, _super);
    function UnzipArchive() {
        _super.apply(this, arguments);
    }
    UnzipArchive.prototype.run = function (config) {
        var _this = this;
        return this.unzip(config)
            .then(function () {
            return _this.deleteZip(config.localPathBase + ".zip");
        })
            .catch(function (err) {
            try {
                _this.deleteUnzippedFolder(config.localPathBase);
            }
            catch (err2) { }
            throw err;
        });
    };
    UnzipArchive.prototype.unzip = function (config) {
        return new es6_promise_1.Promise(function (ok, fail) {
            var stream = fs.createReadStream(config.localPathBase + ".zip")
                .on('error', function (err) {
                fail(err);
            });
            stream.pipe(unzip.Extract({ path: "" + config.localPathBase }))
                .on('close', function () {
                ok();
            });
        });
    };
    UnzipArchive.prototype.deleteZip = function (localPath) {
        return new es6_promise_1.Promise(function (ok, fail) {
            fs.unlink(localPath, function (err) {
                if (err) {
                    return fail(err);
                }
                ok();
            });
        });
    };
    UnzipArchive.prototype.deleteUnzippedFolder = function (localPath) {
        console.log("Deleting folder " + localPath);
        return delete_folder_1.default(localPath);
    };
    return UnzipArchive;
}(task_base_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UnzipArchive;
//# sourceMappingURL=unzip-archive.js.map