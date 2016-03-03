import DeployConfig from './lib/models/deploy-config';
import Deploy from './lib/deploy';
import Permissions from './lib/permissions';

// TODO: Figure out why if we don't 
// export a class with access to the import statements,
// the .d.ts file will not bring over the import statements.
export class shim {
  b: Deploy;
  c: Permissions;
  d: DeployConfig;
}

export {
  Deploy,
  Permissions
}

// TODO: remove this test code
let fs = require('fs')
let path = require('path')
let jsonPath = path.resolve(__dirname, '../deploy-config.json');
let rawConfig = JSON.parse(fs.readFileSync(jsonPath));
let config = new DeployConfig(rawConfig);
let deploy = new Deploy(config);
deploy.run()
.then(() => {
  console.log('done');
})
.catch((err) => {
  console.log(err.stack);
});