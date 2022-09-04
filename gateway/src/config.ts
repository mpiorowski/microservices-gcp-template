import { checkEnv } from '@mpiorowski/utils';

export const Config = {
  NODE_ENV: checkEnv('NODE_ENV'),
  PORT: checkEnv('PORT'),
  COOKIE_SECRET: checkEnv('COOKIE_SECRET'),
  COOKIE_DOMAIN: checkEnv('COOKIE_DOMAIN'),
  CORS_DOMAIN: checkEnv('CORS_DOMAIN'),
  EMAIL_SERVICE_URI: checkEnv('EMAIL_SERVICE_URI'),
  FILES_SERVICE_URI: checkEnv('FILES_SERVICE_URI'),
  USERS_SERVICE_URI: checkEnv('USERS_SERVICE_URI'),
};
