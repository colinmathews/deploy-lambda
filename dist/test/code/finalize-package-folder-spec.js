"use strict";
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var path = require('path');
var fs = require('fs');
var chai_1 = require('chai');
var finalize_package_folder_1 = require('../../lib/tasks/code/finalize-package-folder');
var delete_folder_1 = require('../../lib/util/delete-folder');
var prepare_1 = require('../prepare');
describe('Finalize package folder', function () {
    var subject;
    var config;
    beforeEach(function () {
        config = prepare_1.default().config;
        fs.mkdirSync(config.localPathBase);
        subject = new finalize_package_folder_1.default();
    });
    afterEach(function () {
        this.timeout(30000);
        return delete_folder_1.default(config.localPathBase);
    });
    it('should copy all node_modules', function () {
        this.timeout(10000);
        return subject.run(config)
            .then(function () {
            var folderPath = "" + config.localPathBase;
            chai_1.assert.isTrue(fs.existsSync(folderPath));
            var files = fs.readdirSync(config.localPathBase);
            chai_1.assert.isTrue(files.length > 0);
            var node_modules = files.filter(function (row) {
                return row === 'node_modules';
            });
            chai_1.assert.isTrue(node_modules.length === 1);
            files = fs.readdirSync(path.resolve(config.localPathBase, 'node_modules'));
            chai_1.assert.isTrue(files.length > 0);
        });
    });
});
//# sourceMappingURL=finalize-package-folder-spec.js.map