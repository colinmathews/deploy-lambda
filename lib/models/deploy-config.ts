export default class DeployConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;

  uniqueID: string;
  localPathBase: string;
  s3KeyBase: string;
  s3KeyForZip: string;
  extraPathsToInclude: string[];
  extraPathsToExclude: string[];

  lambdaFunctionNames: string[];
  lambdaAlias: string;
  awsPrincipal: string;
  maxUnboundVersionsToKeep: number;

  constructor(props: any = {}) {
    Object.keys(props).forEach((key) => {
      this[key] = props[key];
    });
  }
}
