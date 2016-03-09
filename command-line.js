#!/usr/bin/env node --harmony
var program = require('commander');
var path = require('path');
var fs = require('fs');
var Promise = require('es6-promise').Promise;
var DeployConfig = require('./dist/index').DeployConfig;
var Permissions = require('./dist/index').Permissions;
var Deploy = require('./dist/index').Deploy;

function parseInt(val) {
  return parseInt(val, 10);
}
function list(val) {
  return val.split(',');
}

var cmd = 'deploy'
var result = program
  .arguments('[action]')
  .usage('[options] [deploy|permissions]')
  .option('-c, --config <file-path>', 'JSON config file of options')
  .option('-k, --key <text>', 'aws access key')
  .option('-s, --secret <text>', 'aws secret key')
  .option('-r, --region <text>', 'aws region')
  .option('-b, --bucket <text>', 'aws s3 bucket')
  .option('-f, --functions <comma list>', 'function names to deploy', list)
  .option('-a, --alias <text>', 'alias to point to deployed versions')
  .option('-m, --max-versions <number>', 'delete all but N unbound versions', parseInt)
  .option('-i, --includePaths <comma list>', "local paths to include that aren't part of the repo", list)
  .option('-x, --excludePaths <comma list>', "local paths to exclude that are part of the repo", list)
  .option('-y, --s3-key-base <text>', 'where on s3 to store code')
  .option('-p, --aws-principal <text>', 'aws principal to grant permissions to')
  .action(function(result) {
    cmd = result;
})
.parse(process.argv);

// Parse a config file if given
var raw = {};
if (program.config) {
  var filePath = path.resolve(program.config);
  var raw = fs.readFileSync(filePath);
  try {
    raw = JSON.parse(raw);
  }
  catch(err) {
    console.error('Configuration file was not valid JSON: ' + filePath);
    process.exit(1);
  }
}

// Tweak options
raw.accessKeyId = program.key || raw.accessKeyId;
raw.secretAccessKey = program.secret || raw.secretAccessKey;
raw.region = program.region || raw.region;
raw.bucket = program.bucket || raw.bucket;
raw.s3KeyBase = program.s3KeyBase || raw.s3KeyBase;
raw.extraPathsToInclude = program.includePaths || raw.extraPathsToInclude;
raw.extraPathsToExclude = program.excludePaths || raw.extraPathsToExclude;
raw.lambdaFunctionNames = program.functions || raw.lambdaFunctionNames;
raw.lambdaAlias = program.alias || raw.lambdaAlias;
raw.awsPrincipal = program.awsPrincipal || raw.awsPrincipal;
raw.maxUnboundVersionsToKeep = program.maxVersions || raw.maxUnboundVersionsToKeep;

// Execute
var promise;
var config = new DeployConfig(raw);
switch(cmd) {
  case 'deploy':
    promise = new Deploy(config).run();
    break;
  case 'permissions':
  promise = new Permissions(config).grant();
    break;
  default: 
    console.error('Invalid command to deploy-lambda: ' + cmd);
    process.exit(1);
}

// Wait for finish
promise.then(function(result) {
  process.exit(0);
})
.catch(function(err) {
  console.error(err.stack);
  process.exit(1);
});
