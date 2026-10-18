import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import {
  clientId,
  cognito,
  cognitoErrorResponse,
  isResponse,
  parseBody,
  response,
} from '../shared/auth-utils';

// POST /auth/signup  { username, password, email }
// Cognito emails a verification code, to be submitted to /auth/confirm_signup.
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = parseBody(event, ['username', 'password', 'email'] as const);
  if (isResponse(body)) return body;

  try {
    const { UserConfirmed } = await cognito.send(
      new SignUpCommand({
        ClientId: clientId,
        Username: body.username,
        Password: body.password,
        UserAttributes: [{ Name: 'email', Value: body.email }],
      }),
    );
    return response(201, {
      message: UserConfirmed
        ? 'User registered'
        : 'User registered. Check your email for the confirmation code.',
      username: body.username,
      confirmed: UserConfirmed ?? false,
    });
  } catch (err) {
    return cognitoErrorResponse(err);
  }
};
