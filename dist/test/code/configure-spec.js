"use strict";
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var chai_1 = require('chai');
var deploy_config_1 = require('../../lib/models/deploy-config');
var configure_1 = require('../../lib/tasks/code/configure');
describe('Create git archive', function () {
    var subject;
    var config;
    beforeEach(function () {
        subject = new configure_1.default();
    });
    it('should fill the config with values', function () {
        this.timeout(5000);
        config = new deploy_config_1.default();
        config.s3KeyBase = 'test-s3-dir/';
        return subject.run(config)
            .then(function () {
            chai_1.assert.isNotNull(config.uniqueID);
            chai_1.assert.isNotNull(config.localPathBase);
            chai_1.assert.isTrue(config.localPathBase.indexOf(config.uniqueID) === config.localPathBase.length - config.uniqueID.length);
            chai_1.assert.isNotNull(config.s3KeyBase);
            chai_1.assert.isNotNull(config.s3KeyForZip);
            chai_1.assert.isTrue(config.s3KeyForZip.indexOf('.zip') > 0 && config.s3KeyForZip.indexOf(config.s3KeyBase) === 0);
        });
    });
});
//# sourceMappingURL=configure-spec.js.map