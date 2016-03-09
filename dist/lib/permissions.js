"use strict";
var es6_promise_1 = require('es6-promise');
var aws_sdk_1 = require('aws-sdk');
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var Permissions = (function () {
    function Permissions(config) {
        this.config = config;
        aws_sdk_1.config.update({
            credentials: new aws_sdk_1.Credentials(config.accessKeyId, config.secretAccessKey),
            region: config.region
        });
    }
    Permissions.prototype.listDeployPermissions = function () {
        return ['lambda:ListAliases', 'lambda:ListVersionsByFunction', 'lambda:UpdateAlias', 'lambda:DeleteFunction', 'lambda:InvokeFunction'];
    };
    Permissions.prototype.grant = function () {
        var _this = this;
        var permissions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            permissions[_i - 0] = arguments[_i];
        }
        if (permissions.length === 0) {
            permissions = this.listDeployPermissions();
        }
        var promises = this.config.lambdaFunctionNames.reduce(function (result, functionName) {
            var add = permissions.map(function (permission) {
                return _this.grantPermission(_this.config.awsPrincipal, functionName, permission);
            });
            return result.concat(add);
        }, []);
        return es6_promise_1.Promise.all(promises);
    };
    Permissions.prototype.grantPermission = function (principal, functionName, permission) {
        var lambda = new AWS.Lambda();
        return new es6_promise_1.Promise(function (ok, fail) {
            console.log("Granting " + permission + " to " + principal + " on " + functionName + "...");
            lambda.addPermission({
                FunctionName: functionName,
                Action: permission,
                Principal: principal,
                StatementId: uuid.v4().replace(/-/g, '')
            }, function (err, result) {
                if (err) {
                    return fail(err);
                }
                ok(result);
            });
        });
    };
    return Permissions;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Permissions;
//# sourceMappingURL=permissions.js.map