import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import {
  clientId,
  cognito,
  cognitoErrorResponse,
  isResponse,
  parseBody,
  response,
} from '../shared/auth-utils';

// POST /auth/confirm_signup  { username, code }
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = parseBody(event, ['username', 'code'] as const);
  if (isResponse(body)) return body;

  try {
    await cognito.send(
      new ConfirmSignUpCommand({
        ClientId: clientId,
        Username: body.username,
        ConfirmationCode: body.code,
      }),
    );
    return response(200, { message: 'User confirmed. You can now sign in.', username: body.username });
  } catch (err) {
    return cognitoErrorResponse(err);
  }
};
