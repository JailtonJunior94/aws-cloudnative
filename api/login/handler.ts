import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

AWS.config.update({ region: process.env.AWS_REGION });
const documentClient = new AWS.DynamoDB.DocumentClient();

export const login: APIGatewayProxyHandler = async (event, _context) => {
    const body = JSON.parse(event.body);
    const params = {
        TableName: process.env.DYNAMODB_USERS,
        IndexName: process.env.EMAIL_GSI,
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': body.email
        }
    }

    const data = await documentClient.query(params).promise();
    const user = data.Items[0];
    if (user) {
        if (bcrypt.compareSync(body.password, user.password)) {
            delete user.password;
            return { statusCode: 200, body: JSON.stringify({ token: jwt.sign(user, process.env.JWT_SECRET) }) }
        }
        return { statusCode: 401, body: JSON.stringify({ message: 'Usuário/Senha inválidos!' }) };
    }
    return { statusCode: 401, body: JSON.stringify({ message: 'Usuário/Senha inválidos!' }) };
};
