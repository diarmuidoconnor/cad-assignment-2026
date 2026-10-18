import * as cdk from 'aws-cdk-lib/core';
import * as apig from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as node from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

// User pool plus the Auth API (signup, confirm signup, signin, signout).
export class CognitoStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.userPool = new cognito.UserPool(this, 'UserPool', {
      signInAliases: { username: true, email: true },
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.userPoolClient = this.userPool.addClient('AppClient', {
      authFlows: { userPassword: true },
    });

    const authApi = new apig.RestApi(this, 'AuthApi', {
      description: 'Authentication API',
      endpointTypes: [apig.EndpointType.REGIONAL],
      defaultCorsPreflightOptions: {
        allowOrigins: apig.Cors.ALL_ORIGINS,
      },
    });

    const authResource = authApi.root.addResource('auth');

    const authFn = (name: string, entry: string) =>
      new node.NodejsFunction(this, name, {
        architecture: lambda.Architecture.ARM_64,
        runtime: lambda.Runtime.NODEJS_22_X,
        entry: `${__dirname}/../lambdas/auth/${entry}`,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        environment: {
          USER_POOL_ID: this.userPool.userPoolId,
          CLIENT_ID: this.userPoolClient.userPoolClientId,
          REGION: this.region,
        },
      });

    // POST /auth/<path>
    const routes: [string, string, string][] = [
      ['signup', 'SignupFn', 'signup.ts'],
      ['confirm_signup', 'ConfirmSignupFn', 'confirm-signup.ts'],
      ['signin', 'SigninFn', 'signin.ts'],
      ['signout', 'SignoutFn', 'signout.ts'],
    ];
    for (const [path, name, entry] of routes) {
      authResource
        .addResource(path)
        .addMethod('POST', new apig.LambdaIntegration(authFn(name, entry)));
    }

    new cdk.CfnOutput(this, 'AuthApiUrl', { value: authApi.url });
    new cdk.CfnOutput(this, 'UserPoolId', { value: this.userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: this.userPoolClient.userPoolClientId });
  }
}
