import { fastify } from 'fastify';
import pg from 'pg';
import { migrate } from 'postgres-migrations';
import { errorReport } from '../@utils/error.util.js';
import { Config } from './config.js';
import { userSessionsService } from './services/sessions.service.js';
import { tokenService } from './services/tokens.service.js';
import { usersService } from './services/users.service.js';

console.info('Users service is running');

// fastify setup
const app = fastify();

// error handler
app.setErrorHandler(function (error, request, reply) {
  errorReport(error, request, reply);
});

// services
usersService(app);
userSessionsService(app);
tokenService(app);

// run the server
const start = async () => {
  try {
    // migrations
    const client = new pg.Client(Config.POSTGRES);
    await client.connect();
    try {
      await migrate({ client }, './migrations');
      console.info('Migrations ran successfully');
    } finally {
      await client.end();
    }
    // fastify server startup
    await app.listen({ port: Number(Config.PORT), host: '0.0.0.0' });
    console.info(`Server listening on ${Config.PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
void start();
