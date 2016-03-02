export default class AWSConfig {
  accessKeyId:string;
  secretAccessKey:string;
  region:string;
  
  constructor(props: any = {}) {
    Object.keys(props).forEach((key) => {
      this[key] = props[key];
    });
  }
}
