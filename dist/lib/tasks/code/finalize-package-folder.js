"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var es6_promise_1 = require('es6-promise');
var task_base_1 = require('../task-base');
var delete_folder_1 = require('../../util/delete-folder');
var FinalizePackageFolder = (function (_super) {
    __extends(FinalizePackageFolder, _super);
    function FinalizePackageFolder() {
        _super.apply(this, arguments);
    }
    FinalizePackageFolder.prototype.run = function (config) {
        var _this = this;
        var includes = (config.extraPathsToInclude || []);
        var excludes = (config.extraPathsToExclude || []);
        includes.push('node_modules');
        return this.addPaths(includes, config)
            .then(function () { return _this.removePaths(excludes, config); });
    };
    FinalizePackageFolder.prototype.addPaths = function (paths, config) {
        var _this = this;
        var promises = paths.map(function (include) {
            return _this.execute("cp -r " + _this.rootPath() + "/" + include + " " + config.localPathBase + "/" + include);
        });
        return es6_promise_1.Promise.all(promises);
    };
    FinalizePackageFolder.prototype.removePaths = function (paths, config) {
        var promises = paths.map(function (exclude) {
            return delete_folder_1.default(config.localPathBase + "/" + exclude);
        });
        return es6_promise_1.Promise.all(promises);
    };
    return FinalizePackageFolder;
}(task_base_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FinalizePackageFolder;
//# sourceMappingURL=finalize-package-folder.js.map