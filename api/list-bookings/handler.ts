import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_REGION });
const documentClient = new AWS.DynamoDB.DocumentClient();

export const list: APIGatewayProxyHandler = async (event, _context) => {
    if (event.requestContext.authorizer.role === 'ADMIN') {
        const bookings = await documentClient.scan({
            TableName: process.env.DYNAMODB_BOOKINGS,
        }).promise();

        return { statusCode: 200, body: JSON.stringify(bookings.Items) };
    }
    return { statusCode: 403, body: JSON.stringify({ message: 'Você não está autorizado a fazer essa chamada' }) }
};
