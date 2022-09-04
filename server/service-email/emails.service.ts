import sgMail from '@sendgrid/mail';
import type { FastifyInstance } from 'fastify';
import { EmailContent, EmailContentPubsub } from '../../@types/email.type.js';
import { Errors } from '../../@types/errors.enum.js';
import { apiRequest } from '../@utils/api.util.js';
import { customError } from '../@utils/error.util.js';
import { Config } from './config.js';
import { templates } from './templates.js';

const isPubSub = (body: EmailContent | EmailContentPubsub): body is EmailContentPubsub => {
  return Config.NODE_ENV === 'production' && 'message' in body;
};

export const emailsService = (app: FastifyInstance): void => {
  app.post<{ Body: EmailContent | EmailContentPubsub | null }>('/email', async (request, reply) => {
    const body = request.body;
    let data: EmailContent;
    if (!body) {
      throw customError(Errors.DATA_NOT_FOUND, 404);
    }
    if (isPubSub(body)) {
      data = JSON.parse(Buffer.from(body.message.data, 'base64').toString().trim()) as EmailContent;
    } else {
      data = body;
    }
    const attachments: {
      content: string;
      filename: string;
      disposition: string;
    }[] = [];
    const promises = data.attachments.map(async (file) => {
      if (file.id && file.filename) {
        const attachment = await apiRequest<{ buffer: Buffer }>({
          serviceUrl: Config.FILES_SERVICE_URI,
          api: `files/${file.id}/${file.filename}`,
          method: 'GET',
        });
        attachments.push({
          content: Buffer.from(attachment.buffer).toString('base64'),
          filename: file.filename,
          disposition: 'attachment',
        });
      }
    });
    await Promise.all(promises);

    const template = templates[data.template](data.html);

    const email = {
      to: data.to,
      from: { email: Config.EMAIL_FROM, name: Config.EMAIL_NAME },
      subject: template.subject,
      html: template.html,
      attachments: attachments,
    };
    sgMail.setApiKey(Config.EMAIL_API_KEY);
    await sgMail.send(email);
    return reply.send({ message: 'email sent' });
  });
};
