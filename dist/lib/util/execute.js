"use strict";
var child_process = require('child_process');
function execute(command) {
    var exec = child_process.exec;
    return new Promise(function (ok, fail) {
        exec(command, function (err, result) {
            if (err) {
                return fail(err);
            }
            ok(result);
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = execute;
//# sourceMappingURL=execute.js.map