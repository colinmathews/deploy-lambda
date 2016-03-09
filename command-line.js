#!/usr/bin/env node --harmony
var program = require('commander');

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
  .option('-x, --extra-paths <comma list>', "local paths to include that aren't part of the repo", list)
  .option('-y, --s3-key-base <text>', 'where on s3 to store code')
  .action(function(result) {
    cmd = result;
})
.parse(process.argv);
console.log(JSON.stringify({
  cmd: cmd,
  key: program.key,
  alias: program.alias
}, null, 2));