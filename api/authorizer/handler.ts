import 'source-map-support/register';
import * as jwt from 'jsonwebtoken';

export const authorizer = (event: any, _context: any, callback: any) => {
    const token = event.authorizationToken;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        callback(null, generatePolicy('user', 'Allow', event.methodArn, user));
    } catch (e) {
        console.log(e);
        callback(null, generatePolicy('user', 'Deny', event.methodArn));
    }
};

const generatePolicy = function (principalId: any, effect: any, resource: any, user?: any) {
    const authResponse: any = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument: any = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne: any = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    if (user) {
        authResponse.context = user;
    }
    return authResponse;
}