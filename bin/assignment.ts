#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { CognitoStack } from '../lib/cognito-stack';
import { AppApiStack } from '../lib/app-api-stack';

const app = new cdk.App();
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const cognitoStack = new CognitoStack(app, 'CognitoStack', { env });

new AppApiStack(app, 'AppApiStack', {
  env,
  userPool: cognitoStack.userPool,
  userPoolClient: cognitoStack.userPoolClient,
});
