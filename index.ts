import DeployConfig from './lib/models/deploy-config';
import Configure from './lib/tasks/code/configure';
import CreateGitArchive from './lib/tasks/code/create-git-archive';
import FinalizePackageFolder from './lib/tasks/code/finalize-package-folder';
import UnzipArchive from './lib/tasks/code/unzip-archive';
import ZipApplication from './lib/tasks/code/zip-application';
import PublishFunctions from './lib/tasks/lambda/publish-functions';
import UploadCode from './lib/tasks/lambda/upload-code';
import DeleteOldVersions from './lib/tasks/lambda/delete-old-versions';
import deleteFolder from './lib/util/delete-folder';
import execute from './lib/util/execute';
import Deploy from './lib/deploy';
import Permissions from './lib/permissions';

// TODO: Figure out why if we don't 
// export a class with access to the import statements,
// the .d.ts file will not bring over the import statements.
export class shim {
  a: DeployConfig;
  b: Deploy;
  c: Permissions;
  d: Configure;
  e: CreateGitArchive;
  f: FinalizePackageFolder;
  g: UnzipArchive;
  h: ZipApplication;
  i: PublishFunctions;
  j: UploadCode;
  k: DeleteOldVersions;
}

export {
  DeployConfig,
  Configure,
  CreateGitArchive,
  FinalizePackageFolder,
  UnzipArchive,
  ZipApplication,
  PublishFunctions,
  UploadCode,
  DeleteOldVersions,
  deleteFolder,
  execute,
  Deploy,
  Permissions
}
