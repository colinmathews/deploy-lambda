import AWSConfig from './lib/models/aws-config';
import Deploy from './lib/deploy';
import Permissions from './lib/permissions';

// TODO: Figure out why if we don't 
// export a class with access to the import statements,
// the .d.ts file will not bring over the import statements.
export class shim {
  a: AWSConfig;
  b: Deploy;
  c: Permissions;
}

export {
  AWSConfig,
  Deploy,
  Permissions
}
