import { checkEnv } from '@mpiorowski/utils';

export const Config = {
  PORT: checkEnv('PORT'),
  NODE_ENV: checkEnv('NODE_ENV'),
  EMAIL_SERVICE_URI: checkEnv('EMAIL_SERVICE_URI'),
  POSTGRES: checkEnv('POSTGRES'),
};
