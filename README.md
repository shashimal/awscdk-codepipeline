#  Creating AWS CodePipeline Using AWS CDK

Purpose of this project is to create an AWS CodePipeline using AWS CDK. You can find the instructions from this
[article](https://medium.com/towards-aws/creating-aws-codepipeline-using-aws-cdk-6d6895d56cee).

# Architecture
![AWS Client VPN endpoint](aws-codepipeline.drawio.png?raw=true)

## How to run the project

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
