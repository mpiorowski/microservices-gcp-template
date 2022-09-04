import { EmailTemplates } from '../../@types/email.type.js';
import { Config } from './config.js';

export const templates = {
  [EmailTemplates.MAGIC_LINK]: (args: string[]) => ({
    subject: `Sign in to Application`,
    html: `
      <h1>Hello in Your App</h1>
      <div>We received a request to sign in to Application using this email address.</div>
      <a href="${Config.CORS_DOMAIN}/token?token=${args[0] ?? ''}">Sign in to Application</a>
      <div>If you did not make this request, please ignore this email.</div>
      <div>Thanks, Your Application team</div>
    `,
  }),
  [EmailTemplates.WELCOME]: () => ({
    subject: `Welcome to Application`,
    html: `
      <h1>Hello from Application</h1>
      <div>Just checking if everything is ok</div>
    `,
  }),
};
