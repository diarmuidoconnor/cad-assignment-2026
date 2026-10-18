import type { APIGatewayProxyResult } from 'aws-lambda';
import { response } from '../shared/auth-utils';

// POST /auth/signout
// Clears the token cookie. Cognito ID tokens can't be revoked, so a copy of the
// token held elsewhere stays valid until it expires.
export const handler = async (): Promise<APIGatewayProxyResult> =>
  response(
    200,
    { message: 'Signed out' },
    { 'set-cookie': 'token=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None' },
  );
