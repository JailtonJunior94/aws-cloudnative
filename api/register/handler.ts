import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const register: APIGatewayProxyHandler = async (event, _context) => {
  console.log('event: ', event);
  return { statusCode: 200, body: JSON.stringify({ message: process.env.DYNAMODB_USERS }) };
}
