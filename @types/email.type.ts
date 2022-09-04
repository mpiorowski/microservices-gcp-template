import type { CloudFile } from './files.type.js';

export type EmailContent = {
  to: string;
  template: EmailTemplates;
  html: string[];
  attachments: CloudFile[];
};

export type EmailContentPubsub = {
  message: {
    data: string;
  };
};

export enum EmailTemplates {
  WELCOME = 'WELCOME',
  MAGIC_LINK = 'MAGIC_LINK',
}
