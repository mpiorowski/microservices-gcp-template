import type { MercuriusContext } from 'mercurius';
import { User } from '../../../@types/users.type.js';
import { Config } from '../config.js';
import { apiRequest } from '../utils/api.util.js';
import { authorization } from '../utils/auth.util.js';
import { handleError } from '../utils/error.util.js';

export const usersQuery = {
  userSession: async (_obj: unknown, _args: unknown, ctx: MercuriusContext) => {
    try {
      return await authorization(ctx.reply.request);
    } catch (error) {
      return handleError(error);
    }
  },
  users: async (_obj: unknown, _args: unknown, ctx: MercuriusContext) => {
    try {
      await authorization(ctx.reply.request);
      const users = await apiRequest<User[]>({
        serviceUrl: Config.USERS_SERVICE_URI,
        api: 'users',
        method: 'GET',
      });
      return users;
    } catch (error) {
      return handleError(error);
    }
  },
};
