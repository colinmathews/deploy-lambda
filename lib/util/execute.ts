import child_process = require('child_process');

export default function execute(command: string): Promise<any> {
  'use strict';
  let exec = child_process.exec;
  return new Promise((ok, fail) => {
    exec(command, (err, result) => {
      if (err) {
        return fail(err);
      }
      ok(result);
    });
  });
}
