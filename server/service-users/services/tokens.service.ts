import crypto from 'crypto';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { EmailContent, EmailTemplates } from '../../../@types/email.type.js';
import { TokenType } from '../../../@types/users.type.js';
import { sendEmail } from '../../@utils/email.util.js';
import { Config } from '../config.js';
import { insertToken } from './tokens.db.js';

export const tokenService = (app: FastifyInstance) => {
  app.post<{ Body: { email: string } }>('/tokens', async (request, reply) => {
    const { email } = request.body;
    z.string().email().parse(email);

    const token = crypto.randomBytes(32).toString('hex');
    const emailContent: EmailContent = {
      to: email,
      template: EmailTemplates.MAGIC_LINK,
      html: [token],
      attachments: [],
    };

    void insertToken(token, TokenType.MAGIC_LINK, email);
    void sendEmail(emailContent, Config.EMAIL_SERVICE_URI);

    return reply.send({ data: true });
  });
};
