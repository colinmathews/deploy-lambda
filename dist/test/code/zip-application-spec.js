"use strict";
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var path = require('path');
var fs = require('fs');
var chai_1 = require('chai');
var zip_application_1 = require('../../lib/tasks/code/zip-application');
var delete_folder_1 = require('../../lib/util/delete-folder');
var prepare_1 = require('../prepare');
describe('Zip application', function () {
    var subject;
    var config;
    var testFileName = new Date().toString() + '.txt';
    var fileContents = 'hi';
    beforeEach(function () {
        config = prepare_1.default().config;
        subject = new zip_application_1.default();
        if (!fs.existsSync(config.localPathBase)) {
            fs.mkdirSync(config.localPathBase);
        }
        fs.writeFileSync(path.resolve(config.localPathBase, testFileName), fileContents);
    });
    afterEach(function () {
        this.timeout(10000);
        var zipPath = config.localPathBase + ".zip";
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }
        return delete_folder_1.default(config.localPathBase);
    });
    it('should zip the application', function () {
        this.timeout(5000);
        return subject.run(config)
            .then(function () {
            var folderPath = "" + config.localPathBase;
            chai_1.assert.isFalse(fs.existsSync(folderPath));
            var zipPath = config.localPathBase + ".zip";
            chai_1.assert.isTrue(fs.existsSync(zipPath));
        });
    });
});
//# sourceMappingURL=zip-application-spec.js.map