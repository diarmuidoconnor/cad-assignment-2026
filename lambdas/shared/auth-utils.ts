import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { isResponse, parseJsonObject, response } from './http';

export { isResponse, response };

export const cognito = new CognitoIdentityProviderClient({ region: process.env.REGION });
export const clientId = process.env.CLIENT_ID!;

// Parses the JSON body and checks the required string fields are present.
// Returns the fields, or a 400 response describing what is wrong.
export const parseBody = (
  event: APIGatewayProxyEvent,
  fields: readonly string[],
): Record<string, string> | APIGatewayProxyResult => {
  const body = parseJsonObject(event);
  if (isResponse(body)) return body;
  const missing = fields.filter((f) => typeof body[f] !== 'string' || body[f] === '');
  if (missing.length) {
    return response(400, { message: `Missing or invalid fields: ${missing.join(', ')}` });
  }
  return body as Record<string, string>;
};

// Unknown user and wrong password both map to 401 so usernames can't be probed.
const cognitoErrorStatus: Record<string, number> = {
  NotAuthorizedException: 401,
  UserNotFoundException: 401,
  UserNotConfirmedException: 403,
  UsernameExistsException: 409,
  InvalidPasswordException: 400,
  InvalidParameterException: 400,
  CodeMismatchException: 400,
  ExpiredCodeException: 400,
  TooManyRequestsException: 429,
  TooManyFailedAttemptsException: 429,
  LimitExceededException: 429,
};

export const cognitoErrorResponse = (err: unknown): APIGatewayProxyResult => {
  const name = (err as Error).name;
  const status = cognitoErrorStatus[name];
  if (!status) {
    console.error('Unexpected Cognito error:', err);
    return response(500, { message: 'Internal server error' });
  }
  const message =
    name === 'UserNotFoundException' ? 'Incorrect username or password.' : (err as Error).message;
  return response(status, { message, error: name });
};
