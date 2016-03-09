"use strict";
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var fs = require('fs');
var chai_1 = require('chai');
var create_git_archive_1 = require('../../lib/tasks/code/create-git-archive');
var prepare_1 = require('../prepare');
describe('Create git archive', function () {
    var subject;
    var config;
    beforeEach(function () {
        config = prepare_1.default().config;
        subject = new create_git_archive_1.default();
    });
    afterEach(function () {
        this.timeout(10000);
        var zipPath = config.localPathBase + ".zip";
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }
    });
    it('should create the archive', function () {
        this.timeout(5000);
        return subject.run(config)
            .then(function () {
            var zipPath = config.localPathBase + ".zip";
            chai_1.assert.isTrue(fs.existsSync(zipPath));
            var stats = fs.statSync(zipPath);
            chai_1.assert.isTrue(stats.size > 0);
        });
    });
});
//# sourceMappingURL=create-git-archive-spec.js.map