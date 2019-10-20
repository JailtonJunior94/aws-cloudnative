import { SQSEvent } from 'aws-lambda';
import 'source-map-support/register';
import * as util from 'util';
const messagebird = require('messagebird')(process.env.MESSAGE_BIRD_API_KEY);

util.promisify(messagebird.messages.create)

export const sendSms = async (event: SQSEvent) => {
    const smsPromises = []
    for (const record of event.Records) {
        const message = JSON.parse(record.body).Message
        smsPromises.push(messagebird.messages.create({
            originator: process.env.SMS_PHONE_FROM,
            recipients: [process.env.SMS_PHONE_TO],
            body: message
        }))
    }
    await Promise.all(smsPromises)
    console.log('SMSs enviados com sucesso!')
    return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}
