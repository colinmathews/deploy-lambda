"use strict";
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var path = require('path');
var fs = require('fs');
var chai_1 = require('chai');
var create_git_archive_1 = require('../../lib/tasks/code/create-git-archive');
var unzip_archive_1 = require('../../lib/tasks/code/unzip-archive');
var prepare_1 = require('../prepare');
describe('Unzip git archive', function () {
    var subject;
    var config;
    beforeEach(function () {
        config = prepare_1.default().config;
        subject = new unzip_archive_1.default();
        return new create_git_archive_1.default().run(config);
    });
    afterEach(function () {
        this.timeout(10000);
        var zipPath = config.localPathBase + ".zip";
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }
        return subject.deleteUnzippedFolder(config.localPathBase);
    });
    it('should unzip the archive', function () {
        this.timeout(5000);
        return subject.run(config)
            .then(function () {
            var folderPath = "" + config.localPathBase;
            chai_1.assert.isTrue(fs.existsSync(folderPath));
            var files = fs.readdirSync(config.localPathBase);
            chai_1.assert.isTrue(files.length > 0);
            var node_modules = files.filter(function (row) {
                return row === 'node_modules';
            });
            chai_1.assert.isTrue(node_modules.length === 0);
        });
    });
});
//# sourceMappingURL=unzip-archive-spec.js.map