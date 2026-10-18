import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import {
  clientId,
  cognito,
  cognitoErrorResponse,
  isResponse,
  parseBody,
  response,
} from '../shared/auth-utils';

// POST /auth/signin  { username, password }
// On success, sets the Cognito ID token as the `token` cookie read by the App API's authorizer.
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = parseBody(event, ['username', 'password'] as const);
  if (isResponse(body)) return body;

  try {
    const { AuthenticationResult: result } = await cognito.send(
      new InitiateAuthCommand({
        ClientId: clientId,
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: { USERNAME: body.username, PASSWORD: body.password },
      }),
    );
    if (!result?.IdToken) {
      // e.g. a NEW_PASSWORD_REQUIRED challenge for an admin-created user
      return response(401, { message: 'Sign in requires an additional challenge' });
    }

    const maxAge = result.ExpiresIn ?? 3600;
    return response(
      200,
      { message: 'Signed in', token: result.IdToken, expiresIn: maxAge },
      {
        'set-cookie': `token=${result.IdToken}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=None`,
      },
    );
  } catch (err) {
    return cognitoErrorResponse(err);
  }
};
