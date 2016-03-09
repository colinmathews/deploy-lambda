"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var task_base_1 = require('../task-base');
var CreateGitArchive = (function (_super) {
    __extends(CreateGitArchive, _super);
    function CreateGitArchive() {
        _super.apply(this, arguments);
    }
    CreateGitArchive.prototype.run = function (config) {
        return this.execute("git archive HEAD --format=zip > " + config.localPathBase + ".zip");
    };
    return CreateGitArchive;
}(task_base_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateGitArchive;
//# sourceMappingURL=create-git-archive.js.map