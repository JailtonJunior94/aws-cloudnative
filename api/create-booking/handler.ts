import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

AWS.config.update({ region: process.env.AWS_REGION });
const documentClient = new AWS.DynamoDB.DocumentClient();

export const create: APIGatewayProxyHandler = async (event, _context) => {
    const body = JSON.parse(event.body);
    await documentClient.put({
        TableName: process.env.DYNAMODB_BOOKINGS,
        Item: {
            id: uuid(),
            date: body.date,
            user: event.requestContext.authorizer
        }
    }).promise();

    return { statusCode: 200, body: JSON.stringify({ message: 'Agendamento efetuado com sucesso!' }) };
};
