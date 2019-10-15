import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

AWS.config.update({ region: process.env.AWS_REGION });
const documentClient = new AWS.DynamoDB.DocumentClient();

export const register: APIGatewayProxyHandler = async (event, _context) => {
  const body = JSON.parse(event.body);

  await documentClient.put({
    TableName: process.env.DYNAMODB_USERS,
    Item: {
      id: uuid(),
      name: body.name,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10)
    }
  }).promise();

  return { statusCode: 201, body: JSON.stringify({ message: 'Usuário inserido com sucesso!' }) };
};
