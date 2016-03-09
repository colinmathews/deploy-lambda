"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('date-format-lite');
var es6_promise_1 = require('es6-promise');
var task_base_1 = require('../task-base');
function parseCommitFromGitLog(log) {
    return log.replace('commit ', '').substring(0, 7);
}
var Configure = (function (_super) {
    __extends(Configure, _super);
    function Configure() {
        _super.apply(this, arguments);
    }
    Configure.prototype.run = function (config) {
        var _this = this;
        return es6_promise_1.Promise.resolve()
            .then(function () {
            if (!config.uniqueID) {
                return _this.execute('git log -1');
            }
        })
            .then(function (result) {
            if (!config.uniqueID) {
                var commit = parseCommitFromGitLog(result);
                var alias = '';
                if (config.lambdaAlias) {
                    alias = "-" + config.lambdaAlias;
                }
                config.uniqueID = "deploy" + alias + "-" + commit;
            }
            config.localPathBase = config.localPathBase || _this.rootPath() + "/" + config.uniqueID;
            // Remove last slash so this is normalized
            if (config.s3KeyBase) {
                config.s3KeyBase = config.s3KeyBase.replace(/\/?$/gi, '');
                config.s3KeyForZip = config.s3KeyForZip || config.s3KeyBase + "/" + config.uniqueID + ".zip";
            }
        });
    };
    return Configure;
}(task_base_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Configure;
//# sourceMappingURL=configure.js.map