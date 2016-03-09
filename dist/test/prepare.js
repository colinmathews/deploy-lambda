"use strict";
require('source-map-support').install({
    handleUncaughtExceptions: false
});
var fs = require('fs');
var path = require('path');
var deploy_config_1 = require('../lib/models/deploy-config');
function prepare() {
    var jsonPath = path.resolve(__dirname, '../../deploy-config.json');
    if (!fs.existsSync(jsonPath)) {
        throw new Error("Please create a 'deploy-config.json' file in the root directory of this project to run tests");
    }
    var rawConfig = JSON.parse(fs.readFileSync(jsonPath));
    var config = new deploy_config_1.default(rawConfig);
    config.localPathBase = path.resolve(__dirname, '../../test-run-directory');
    return {
        config: config,
        rawConfig: rawConfig
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = prepare;
//# sourceMappingURL=prepare.js.map