import { checkEnv } from '@mpiorowski/utils';

export const Config = {
  PORT: checkEnv('PORT'),
  NODE_ENV: checkEnv('NODE_ENV'),
  BUCKET_NAME: checkEnv('BUCKET_NAME'),
  POSTGRES: checkEnv('POSTGRES'),
};
