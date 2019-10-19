import * as AWS from 'aws-sdk';
import * as moment from 'moment';
import 'source-map-support/register';
import { DynamoDBStreamEvent } from 'aws-lambda';

const SNS = new AWS.SNS();
AWS.config.update({ region: process.env.AWS_REGION });
const converter = AWS.DynamoDB.Converter;
moment.locale('pt-br');

export const listen = async (event: DynamoDBStreamEvent) => {
  const snsPromises = [];
  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const reservation = converter.unmarshall(record.dynamodb.NewImage);
      snsPromises.push(SNS.publish({
        TopicArn: process.env.SNS_NOTIFICATIONS_TOPIC,
        Message: `Resersa efetuada: o usuário ${reservation.user.name}, e-mail: ${reservation.user.email} agendou um horário em: ${moment(reservation.date).format('LLLL')}`
      }).promise());
    }
  }
  await Promise.all(snsPromises);
  console.log('Mensagem(ns) enviada(s) com sucesso!')
}
