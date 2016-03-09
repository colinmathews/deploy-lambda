"use strict";
var DeployConfig = (function () {
    function DeployConfig(props) {
        var _this = this;
        if (props === void 0) { props = {}; }
        Object.keys(props).forEach(function (key) {
            _this[key] = props[key];
        });
    }
    return DeployConfig;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeployConfig;
//# sourceMappingURL=deploy-config.js.map