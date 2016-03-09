# deploy-lambda
Packages a repo and deploys to AWS Lambda.

## Installation
```
npm install deploy-lambda --save
```

## Testing
TODO:

## Lambda Permissions
At the time of this writing, Lambda requires that functions are created through the AWS console. This package includes a class `Permissions` that can add the necessary permissions to deploy functions, however, there is an open issue that seems this doesn't always take hold.

This is the policy that can be created in IAM. In testing, it seems like this policy had to be applied directly to a user. Permission errors were encountered if the policy was applied to one of the groups the user belonged to.
```
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