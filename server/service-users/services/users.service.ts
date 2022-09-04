import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Errors } from '../../../@types/errors.enum.js';
import { User, UserRole } from '../../../@types/users.type.js';
import { customError } from '../../@utils/error.util.js';
import {
  insertUser,
  selectAllUsers,
  selectUserByEmail,
  selectUserById,
  toggleUser,
  updateUser,
} from './users.db.js';

export const usersService = (app: FastifyInstance) => {
  app.get<{ Reply: User[] }>('/users', async (_request, reply) => {
    const users = await selectAllUsers();
    return reply.send(users);
  });

  app.get<{ Params: { id: string }; Reply: User }>('/users/:id', async (request, reply) => {
    const { id } = request.params;
    z.string().uuid().parse(id);

    const users = await selectUserById(id);
    if (!users[0]) {
      throw customError(Errors.USER_NOT_FOUND, 404);
    }
    return reply.send(users[0]);
  });

  app.post<{ Body: User; Reply: User }>('/users', async (request, reply) => {
    const { email, role } = request.body;
    z.object({
      email: z.string().email().min(1).max(200),
      role: z.nativeEnum(UserRole),
    }).parse({ email, role });

    const checkUser = await selectUserByEmail(email);
    if (checkUser[0]) {
      throw customError(Errors.USER_EXISTS, 409);
    }
    const users = await insertUser({ email, role });
    if (!users[0]) {
      throw customError(Errors.DATA_NOT_CREATED, 409);
    }
    return reply.send(users[0]);
  });

  app.put<{ Body: User; Params: { id: string }; Reply: User }>(
    '/users/:id',
    async (request, reply) => {
      const { email, role } = request.body;
      const { id } = request.params;
      z.object({
        id: z.string().uuid(),
        email: z.string().email().min(1).max(200),
        role: z.nativeEnum(UserRole),
      }).parse({
        id,
        email,
        role,
      });

      const user = await updateUser({
        id: id,
        email: email,
        role: role,
      });
      if (!user[0]) {
        throw customError(Errors.DATA_NOT_UPDATED, 409);
      }
      return reply.send(user[0]);
    },
  );

  app.patch<{ Params: { id: string }; Reply: User }>(
    '/users/:id/toggle',
    async (request, reply) => {
      const { id } = request.params;
      z.string().uuid().parse(id);

      const user = await toggleUser(id);
      if (!user[0]) {
        throw customError(Errors.DATA_NOT_UPDATED, 409);
      }
      return reply.send(user[0]);
    },
  );
};
