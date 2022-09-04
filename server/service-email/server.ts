import FastifyMultipart from '@fastify/multipart';
import Fastify from 'fastify';
import { errorReport } from '../@utils/error.util.js';
import { Config } from './config.js';
import { emailsService } from './emails.service.js';

console.info('Email service is running');

// fastify setup
const app = Fastify.default();
void app.register(FastifyMultipart.default);

// error handler
app.setErrorHandler(function (error, request, reply) {
  errorReport(error, request, reply);
});

// services
emailsService(app);

// run the server
const start = async () => {
  try {
    // fastify server startup
    await app.listen({ port: Number(Config.PORT), host: '0.0.0.0' });
    console.info(`Server listening on ${Config.PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
void start();
