"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var es6_promise_1 = require('es6-promise');
var task_base_1 = require('../task-base');
var delete_folder_1 = require('../../util/delete-folder');
var Zip = require('easy-zip2').EasyZip;
var ZipApplication = (function (_super) {
    __extends(ZipApplication, _super);
    function ZipApplication() {
        _super.apply(this, arguments);
    }
    ZipApplication.prototype.run = function (config) {
        var _this = this;
        var zip = new Zip();
        console.log("Zipping deploy folder " + config.localPathBase + "...");
        return this.zipFolder(zip, config)
            .then(function () {
            console.log("Writing to " + config.localPathBase + ".zip...");
            return _this.writeZip(zip, config);
        })
            .then(function () {
            console.log("Deleting deploy folder " + config.localPathBase + "...");
            return delete_folder_1.default(config.localPathBase);
        });
    };
    ZipApplication.prototype.zipFolder = function (zip, config) {
        return new es6_promise_1.Promise(function (ok, fail) {
            zip.zipFolder(config.localPathBase, {
                rootFolder: ''
            }, function (err, result) {
                if (err) {
                    return fail(err);
                }
                ok(result);
            });
        });
    };
    ZipApplication.prototype.writeZip = function (zip, config) {
        return new es6_promise_1.Promise(function (ok, fail) {
            zip.writeToFile(config.localPathBase + ".zip", function (err, result) {
                if (err) {
                    return fail(err);
                }
                ok(result);
            });
        });
    };
    return ZipApplication;
}(task_base_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ZipApplication;
//# sourceMappingURL=zip-application.js.map