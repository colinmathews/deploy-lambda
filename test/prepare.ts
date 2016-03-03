require('source-map-support').install({
  handleUncaughtExceptions: false
});
let fs = require('fs');
let path = require('path');
import DeployConfig from '../lib/models/deploy-config';

export default function prepare(): DeployConfig {
  let jsonPath = path.resolve(__dirname, '../../aws-config.json');
  if (!fs.existsSync(jsonPath)) {
    throw new Error("Please create a 'aws-config.json' file in the root directory of this project to test with AWS resources")
  }

  let rawConfig = JSON.parse(fs.readFileSync(jsonPath));
  let config = new DeployConfig(rawConfig);
  config.uniqueID = new Date().valueOf().toString();
  config.localPathBase = path.resolve(__dirname, '../../test-run-directory');
  return config;
}
