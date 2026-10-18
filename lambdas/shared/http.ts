import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const response = (
  statusCode: number,
  body: object,
  headers: Record<string, string> = {},
): APIGatewayProxyResult => ({
  statusCode,
  headers: { 'content-type': 'application/json', ...headers },
  body: JSON.stringify(body),
});

export const isResponse = (value: object): value is APIGatewayProxyResult => 'statusCode' in value;

// Parses a JSON object request body, or returns a 400 response.
export const parseJsonObject = (
  event: APIGatewayProxyEvent,
): Record<string, unknown> | APIGatewayProxyResult => {
  let body: unknown;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return response(400, { message: 'Request body must be valid JSON' });
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return response(400, { message: 'Request body must be a JSON object' });
  }
  return body as Record<string, unknown>;
};
