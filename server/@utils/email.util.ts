import { PubSub } from '@google-cloud/pubsub';
import { EmailContent } from '../../@types/email.type.js';
import { apiRequest } from './api.util.js';

const pubSubClient = new PubSub();
export const sendEmail = async (email: EmailContent, EMAIL_SERVICE_URI: string) => {
  console.info('Email send with body', email);
  if (process.env.NODE_ENV === 'production') {
    const emailBuffer = Buffer.from(JSON.stringify(email));
    const messageId = await pubSubClient.topic('email').publishMessage({ data: emailBuffer });
    console.info(`Message published`, messageId);
  } else {
    await apiRequest({
      serviceUrl: EMAIL_SERVICE_URI,
      api: 'email',
      method: 'POST',
      body: email,
    });
  }
};
