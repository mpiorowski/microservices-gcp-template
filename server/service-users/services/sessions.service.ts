import dayjs from 'dayjs';
import type { FastifyInstance } from 'fastify';
import { string, z } from 'zod';
import { GlobalConfig } from '../../../@types/config.enum.js';
import { Errors } from '../../../@types/errors.enum.js';
import { TokenType, UserRole, UserSession } from '../../../@types/users.type.js';
import { customError } from '../../@utils/error.util.js';
import { insertUserSession, selectUserSessionById } from './sessions.db.js';
import { selectToken } from './tokens.db.js';
import { selectUserByEmail, updateUserLastLogin, upsertUser } from './users.db.js';

export const userSessionsService = (app: FastifyInstance) => {
  app.get<{ Params: { id: string }; Reply: UserSession }>(
    '/sessions/:id',
    async (request, reply) => {
      const { id } = request.params;
      z.string().uuid().parse(id);

      const userSession = (await selectUserSessionById(id))[0];
      if (!userSession) {
        throw customError(Errors.USER_SESSION_NOT_FOUND, 401);
      }
      if (userSession.expires < new Date()) {
        throw customError(Errors.USER_SESSION_EXPIRED, 402);
      }
      await updateUserLastLogin(userSession.userId);
      return reply.send(userSession);
    },
  );

  app.post<{ Body: { email: string; token: string }; Reply: UserSession }>(
    '/sessions',
    async (request, reply) => {
      const { email, token } = request.body;
      const schema = z.object({
        email: string().email().min(1).max(200),
        token: string().min(1),
      });
      schema.parse({ email, token });
      const checkToken = await selectToken(token, TokenType.MAGIC_LINK, email);

      if (!checkToken[0]) {
        throw customError(Errors.TOKEN_NOT_FOUND, 404);
      }

      let users;
      users = await selectUserByEmail(email);
      if (!users[0]) {
        users = await upsertUser({ email, role: UserRole.ROLE_USER });
        if (!users[0]?.id) {
          throw customError(Errors.DATA_NOT_CREATED, 409);
        }
      } else if (!users[0].active) {
        throw customError(Errors.USER_NOT_ACTIVE, 409);
      }

      const userSessions = await insertUserSession({
        userId: users[0].id,
        role: users[0].role,
        expires: dayjs().add(Number(GlobalConfig.USER_SESSION_EXPIRE_IN_HOURS), 'hours').toDate(),
      });
      if (!userSessions[0]?.id) {
        throw customError(Errors.DATA_NOT_CREATED, 409);
      }
      return reply.send(userSessions[0]);
    },
  );
};
