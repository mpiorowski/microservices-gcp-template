import createError from '@fastify/error';
import { ErrorReporting } from '@google-cloud/error-reporting';
import mercurius from 'mercurius';
import { Config } from '../config.js';

export const customError = (message: string, statusCode: number) => {
  const error = createError('FST_ERR_CUSTOM_ERROR', message, statusCode);
  return new error();
};

type ServiceError = {
  statusCode: number;
  code: string;
  error: string;
  message: string;
};

const isServiceError = (error: unknown): error is ServiceError => {
  if (error && typeof error === 'object' && 'statusCode' in error && 'message' in error) {
    return true;
  }
  return false;
};

const errors = new ErrorReporting();
export const handleError = (error: unknown) => {
  if (Config.NODE_ENV === 'production') {
    errors.report(error);
  } else {
    console.error('gateway error', error);
  }
  if (isServiceError(error)) {
    throw new mercurius.default.ErrorWithProps(
      error.message,
      {
        code: error.code,
        timestamp: Math.round(new Date().getTime() / 1000),
      },
      error.statusCode,
    );
  } else {
    throw new mercurius.default.ErrorWithProps(
      'errors.something-went-wrong',
      {
        timestamp: Math.round(new Date().getTime() / 1000),
      },
      409,
    );
  }
};
