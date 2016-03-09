"use strict";
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var path = require('path');
var fs = require('fs');
var delete_old_versions_1 = require('../../lib/tasks/lambda/delete-old-versions');
var prepare_1 = require('../prepare');
describe('Delete old versions', function () {
    var config;
    var subject;
    beforeEach(function () {
        var preparation = prepare_1.default();
        config = preparation.config;
        subject = new delete_old_versions_1.default();
    });
    it('should list old versions to delete', function () {
        this.timeout(8000);
        return subject.getVersionInfoByFunction(config)
            .then(function (result) {
            return subject.getUnboundVersionsToDelete(result, config);
        })
            .then(function (result) {
            // Nothing easy to test here
            console.log(JSON.stringify(result, null, 2));
        });
    });
    it('should delete old versions', function () {
        this.timeout(8000);
        return subject.run(config)
            .then(function (result) {
            // Nothing easy to test here
            console.log(JSON.stringify(result, null, 2));
        });
    });
});
//# sourceMappingURL=delete-old-versions-spec.js.map