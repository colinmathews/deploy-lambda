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
var DeleteOldVersions = (function (_super) {
    __extends(DeleteOldVersions, _super);
    function DeleteOldVersions() {
        _super.apply(this, arguments);
    }
    DeleteOldVersions.prototype.run = function (config) {
        var _this = this;
        this.configureAWS(config);
        if (!config.maxUnboundVersionsToKeep) {
            return es6_promise_1.Promise.resolve();
        }
        return this.getVersionInfoByFunction(config)
            .then(function (result) {
            return _this.getUnboundVersionsToDelete(result, config);
        })
            .then(function (result) {
            return _this.deleteVersions(result);
        });
    };
    DeleteOldVersions.prototype.getUnboundVersionsToDelete = function (versionInfo, config) {
        var _this = this;
        if (!config.maxUnboundVersionsToKeep) {
            return [];
        }
        this.configureAWS(config);
        return Object.keys(versionInfo).reduce(function (final, key) {
            var info = versionInfo[key];
            var toDelete = _this.getUnboundVersionsForFunction(info.versions, info.aliases)
                .slice(0, config.maxUnboundVersionsToKeep);
            return final.concat(toDelete);
        }, []);
    };
    DeleteOldVersions.prototype.getVersionInfoByFunction = function (config) {
        var _this = this;
        this.configureAWS(config);
        var versionInfo;
        return this.listVersions(config)
            .then(function (result) {
            versionInfo = result.reduce(function (final, row) {
                final[row.functionName] = {
                    versions: row.versions
                };
                return final;
            }, {});
            return _this.listAliases(config);
        })
            .then(function (result) {
            versionInfo = result.reduce(function (final, row) {
                final[row.functionName].aliases = row.aliases;
                return final;
            }, versionInfo);
            return versionInfo;
        });
    };
    DeleteOldVersions.prototype.deleteVersions = function (versions, config) {
        if (config) {
            this.configureAWS(config);
        }
        var lambda = new AWS.Lambda();
        var promises = versions.map(function (version) {
            return new es6_promise_1.Promise(function (ok, fail) {
                console.log("Deleting version " + version.Version + " of lambda function \"" + version.FunctionName + "\"...");
                lambda.deleteFunction({
                    FunctionName: version.FunctionName,
                    Qualifier: version.Version
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
    DeleteOldVersions.prototype.configureAWS = function (config) {
        if (this.hasConfiguredAWS) {
            return;
        }
        this.hasConfiguredAWS = true;
        aws_sdk_1.config.update({
            credentials: new aws_sdk_1.Credentials(config.accessKeyId, config.secretAccessKey),
            region: config.region
        });
    };
    DeleteOldVersions.prototype.listVersions = function (config) {
        var lambda = new AWS.Lambda();
        var promises = config.lambdaFunctionNames.map(function (name) {
            return new es6_promise_1.Promise(function (ok, fail) {
                console.log("Getting versions for function \"" + name + "\"...");
                lambda.listVersionsByFunction({
                    FunctionName: name
                }, function (err, result) {
                    if (err) {
                        return fail(err);
                    }
                    ok({
                        functionName: name,
                        versions: result.Versions
                    });
                });
            });
        });
        return es6_promise_1.Promise.all(promises);
    };
    DeleteOldVersions.prototype.listAliases = function (config) {
        var lambda = new AWS.Lambda();
        var promises = config.lambdaFunctionNames.map(function (name) {
            return new es6_promise_1.Promise(function (ok, fail) {
                console.log("Getting aliases for function \"" + name + "\"...");
                lambda.listAliases({
                    FunctionName: name
                }, function (err, result) {
                    if (err) {
                        return fail(err);
                    }
                    ok({
                        functionName: name,
                        aliases: result.Aliases
                    });
                });
            });
        });
        return es6_promise_1.Promise.all(promises);
    };
    DeleteOldVersions.prototype.getUnboundVersionsForFunction = function (versions, aliases) {
        var unbound = versions.filter(function (version) {
            if (version.Version === '$LATEST') {
                return false;
            }
            var found = aliases.filter(function (alias) {
                return alias.FunctionVersion === version.Version;
            });
            return found.length === 0;
        });
        unbound.sort(function (a, b) {
            if (a.LastModififed < b.LastModified) {
                return -1;
            }
            if (a.LastModififed > b.LastModified) {
                return 1;
            }
            return 0;
        });
        return unbound;
    };
    return DeleteOldVersions;
}(task_base_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeleteOldVersions;
//# sourceMappingURL=delete-old-versions.js.map