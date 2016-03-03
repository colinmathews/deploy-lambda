export default class DeployConfig {
  uniqueID: string;
  targetEnvironment: string;
  localPathBase: string;
  s3KeyBase: string;
  s3KeyForZip: string;
  extraPathsToInclude: string[];
  extraPathsToExclude: string[];

  constructor(props: any = {}) {
    Object.keys(props).forEach((key) => {
      this[key] = props[key];
    });
  }
}
