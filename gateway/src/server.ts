import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { fastify } from 'fastify';
import mercurius from 'mercurius';
import path, { join } from 'path';
import { filesApi } from './api/files.api.js';
import { Config } from './config.js';
import { loaders } from './loaders.js';
import { resolvers } from './resolvers.js';

console.info('Gateway is running');

// fastify setup
const app = fastify();
void app.register(cookie, {
  secret: Config.COOKIE_SECRET, // for cookies signature
});
void app.register(cors.default, {
  origin: Config.CORS_DOMAIN,
  credentials: true,
});
void app.register(multipart.default);

// error handler
app.setErrorHandler(function (error, _, reply) {
  void reply.code(500).send(error);
});

const schema = loadSchemaSync(join(path.resolve(), './src/graphql/*.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

// mercurius
void app.register(mercurius.default, {
  schema: schema,
  resolvers,
  loaders,
  graphiql: Config.NODE_ENV === 'development',
});

// api
filesApi(app);

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
