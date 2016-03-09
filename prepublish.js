var exec = require('child_process').exec;

function fail(err) {
  var message = err;
  if (err.stack) {
    message = err.stack;
  }
  console.error(message);
  process.exit(1);
}

function ok() {
  process.exit();
}

exec('git status --porcelain | grep "^\\s*M" | wc -l', function(err, result) {
  if (err) {
    return fail(err);
  }
  result = result.trim();
  result = parseInt(result, 10);
  if (isNaN(result)) {
    return fail('Unexpected result: ' + result);
  }
  if (result > 0) {
    return fail('There are ' + result + ' uncommitted file(s). Please stash or commit these changes before publishing.');
  }
  ok();
});
