"use strict";
var execute_1 = require('../util/execute');
var path = require('path');
// TODO: This should be an abstract class, but tsc isn't liking that
var TaskBase = (function () {
    function TaskBase() {
    }
    // TODO: This should be an abstract method
    TaskBase.prototype.run = function (config) {
        throw new Error('Subclasses of TaskBase must override this method');
    };
    TaskBase.prototype.rootPath = function () {
        var root = path.resolve();
        return root.replace(/\/?$/gi, '');
    };
    TaskBase.prototype.execute = function (command) {
        console.log("Executing " + command);
        return execute_1.default(command);
    };
    return TaskBase;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TaskBase;
//# sourceMappingURL=task-base.js.map