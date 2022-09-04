import createError from '@fastify/error';
import { ErrorReporting } from '@google-cloud/error-reporting';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const customError = (message: string, statusCode: number) => {
  const error = createError('FST_ERR_CUSTOM_ERROR', message, statusCode);
  return new error();
};

const errors = new ErrorReporting();

export const errorReport = (error: unknown, request: FastifyRequest, reply: FastifyReply) => {
  if (process.env.NODE_ENV === 'production') {
    errors.report(error);
  } else {
    console.error('Error handler');
    console.error('error', error);
    console.error('request', request);
  }
  void reply.send(error);
};
