# deploy-lambda
Packages up the last commit of your repo and publishes it to Lambda on AWS. 

## Installation
```
npm install deploy-lambda --save-dev
```

## Preparing AWS
At the time of this writing, Lambda requires that functions are created through the AWS console. After doing so you'll need to grant permissions to invoke and deploy your functions. See [this section](#lambda-permissions) for how to do this.

## Before you deploy
This module deploys your last commit for the branch you're currently on. It's important that you've run `npm install` before deploying as those modules will be bundled with your code.

## Deploying your repo with npm
The simplest way to use this module is to create an npm script to deploy your repo to lambda. Use a package.json like below. This example uses a `deploy-config.json` like below for simplicity. See [this section](#advanced-npm-script-usage) for advanced command line usage.
```javascript
{
  "name": "deploy-lambda-example",
  "version": "1.0.0",
  "scripts": {
    "deploy": "deploy-lambda deploy -c deploy-config.json"
  },
  "devDependencies": {
    "deploy-lambda": "1.0.4"
  }
}
```

## API
You can customize and extend your use of `deploy-lambda` in your application in lots of ways. The configuration options are explained here:


Key | Description
--- | ---
accessKeyId | Your AWS key
secretAccessKey | Your AWS secret key
region | The AWS region hosting your S3 and Lambda resources
bucket | The bucket that will host your code
s3KeyBase | The prefixed path to code that will be uploaded
extraPathsToInclude | In addition to all the files included in your git repo, these untracked paths will be included. `node_modules` is automatically included.
extraPathsToExclude | Paths in your git repo that you do NOT want deployed.
lambdaFunctionNames | A list of function names that you want to publish this repo to.
lambdaAlias | The alias name if you would like to publish function versions to an existing lambda alias
maxUnboundVersionsToKeep | Because Lambda has a pretty strict limit on how much code storage you're allowed, this option lets you automatically delete versions of your functions that aren't tied to an alias when you publish.
awsPrincipal | For granting permissions, this is the IAM resource you want to grant lambda permissions to. Something like `"arn:aws:iam::12345678:user/myapp",`

The basic example looks like this:
```javascript
var Deploy = require('deploy-lambda').Deploy;
var DeployConfig = require('deploy-lambda').DeployConfig;

var config = new DeployConfig({
  accessKeyId: "<YOUR INFO>",
  secretAccessKey: "<YOUR INFO>",
  region: "us-east-1",
  bucket: "<YOUR INFO>",
  s3KeyBase: "<YOUR INFO>",
  extraPathsToInclude: [],
  extraPathsToExclude: [],
  lambdaFunctionNames: ["<YOUR INFO>"],
  lambdaAlias: "<YOUR INFO>",
  maxUnboundVersionsToKeep: 2,
  awsPrincipal: "<YOUR INFO>"
});

var deploy = new Deploy(config);
deploy.run()
.then(function() {
  console.log('done!');
})
.catch(function(err){
  console.error(err.stack);
});
```

## Testing this repo
Create a file named `deploy-config.json` (ignored by git) to hold your AWS keys, etc.
```javascript
{
  "accessKeyId": "<YOUR INFO>",
  "secretAccessKey": "<YOUR INFO>",
  "region": "us-east-1",
  "bucket": "<YOUR INFO>",
  "s3KeyBase": "<YOUR INFO>",
  "extraPathsToInclude": [],
  "extraPathsToExclude": [],
  "lambdaFunctionNames": ["<YOUR INFO>"],
  "lambdaAlias": "<YOUR INFO>",
  "maxUnboundVersionsToKeep": 2,
  "awsPrincipal": "<YOUR INFO>",
  
  // Set to false to skip granting AWS Lambda permissions during testing
  "testPermissions": true,
  
  // Omit this key to skip publishing this repo to Lambda during testing
  "testPublishThisRepo": {
    // Add the key 'existingS3KeyForZip' if you have a zip file on S3 to use instead of this repo
  }
}
```

Run tests with
```
npm test
```

## Lambda Permissions
This package includes a class `Permissions` that can add the necessary permissions to deploy functions, however, there is an open issue that seems this doesn't always take hold.

This is the policy that can be created in IAM. In testing, it seems like this policy had to be applied directly to a user. Permission errors were encountered if the policy was applied to one of the groups the user belonged to.
```javascript
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": <ANY STRING OF CHARS>,
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction",
        "lambda:ListAliases",
        "lambda:ListVersionsByFunction",
        "lambda:UpdateAlias",
        "lambda:DeleteFunction"
      ],
      "Resource": [
        "arn:aws:lambda:us-east-1:<ACCOUNT ID>:function:<FUNCTION NAME>"
      ]
    }
  ]
}
```

Example code for using this module to grant permissions:
```
var Permissions = require('deploy-lambda').Permissions;
var DeployConfig = require('deploy-lambda').DeployConfig;

var config = new DeployConfig({
  accessKeyId: "<YOUR INFO>",
  secretAccessKey: "<YOUR INFO>",
  region: "us-east-1",
  lambdaFunctionNames: ["<YOUR INFO>"],
  lambdaAlias: "<YOUR INFO>",
  awsPrincipal: "<YOUR INFO>"
});

var permissions = new Permissions(config);
permissions.grant()
.then(function() {
  console.log('done!');
})
.catch(function(err){
  console.error(err.stack);
});
```

## Advanced npm script usage
```javascript
  // package.json
  ...
  "scripts": {
    "deploy": "deploy-lambda deploy -c deploy-config.json"
    "grant-permissions": "deploy-lambda permissions -c deploy-config.json"
  },
  ...
```
```
  Options:

    -h, --help                       output usage information
    -c, --config <file-path>         JSON config file of options
    -k, --key <text>                 aws access key
    -s, --secret <text>              aws secret key
    -r, --region <text>              aws region
    -b, --bucket <text>              aws s3 bucket
    -f, --functions <comma list>     function names to deploy
    -a, --lambda-alias <text>        alias to point to deployed versions
    -m, --max-versions <number>      delete all but N unbound versions
    -i, --includePaths <comma list>  local paths to include that aren't part of the repo
    -x, --excludePaths <comma list>  local paths to exclude that are part of the repo
    -y, --s3-key-base <text>         where on s3 to store code
    -p, --aws-principal <text>       aws principal to grant permissions to
```
