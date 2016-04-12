"use strict";
var fs = require('fs');
var execute_1 = require('./execute');
function deleteFolder(localPath) {
    'use strict';
    return new Promise(function (ok, fail) {
        fs.exists(localPath, function (exists) {
            return ok(exists);
        });
    })
        .then(function (exists) {
        return execute_1.default("rm -rf " + localPath);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deleteFolder;
//# sourceMappingURL=delete-folder.js.map