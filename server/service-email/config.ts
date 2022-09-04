import { checkEnv } from '@mpiorowski/utils';

export const Config = {
  PORT: checkEnv('PORT'),
  NODE_ENV: checkEnv('NODE_ENV'),
  EMAIL_API_KEY: checkEnv('EMAIL_API_KEY'),
  EMAIL_FROM: checkEnv('EMAIL_FROM'),
  EMAIL_NAME: checkEnv('EMAIL_NAME'),
  CORS_DOMAIN: checkEnv('CORS_DOMAIN'),
  FILES_SERVICE_URI: checkEnv('FILES_SERVICE_URI'),
};
