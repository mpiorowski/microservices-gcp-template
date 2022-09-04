import { assertIsDefined } from '@mpiorowski/utils';
import { MercuriusContext } from 'mercurius';
import { GlobalConfig } from '../../../@types/config.enum.js';
import { TokenType, User, UserRole, UserSession } from '../../../@types/users.type.js';
import { Config } from '../config.js';
import { apiRequest } from '../utils/api.util.js';
import { authorization } from '../utils/auth.util.js';
import { handleError } from '../utils/error.util.js';

export const usersMutation = {
  sendToken: async (_obj: unknown, args: { email: string; type: TokenType }) => {
    try {
      await apiRequest<{ email: string; type: TokenType }>({
        serviceUrl: Config.USERS_SERVICE_URI,
        api: 'tokens',
        method: 'POST',
        body: args,
      });
      return;
    } catch (error) {
      return handleError(error);
    }
  },
  logout: (_obj: unknown, _args: unknown, ctx: MercuriusContext) => {
    try {
      void ctx.reply.setCookie('sessionId', '', {
        path: '/',
        secure: process.env.NODE_ENV === 'production' ? true : false, // send cookie over HTTPS only
        domain: Config.COOKIE_DOMAIN,
        httpOnly: true,
        sameSite: true,
        expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      });
      ctx.reply.request.cookies.sessionId = '';
      return '';
    } catch (error) {
      return handleError(error);
    }
  },
  insertUserSession: async (
    _obj: unknown,
    args: { email: string; token: string },
    ctx: MercuriusContext,
  ) => {
    try {
      const newSession = await apiRequest<{ email: string; token: string }, UserSession>({
        serviceUrl: Config.USERS_SERVICE_URI,
        api: 'sessions',
        method: 'POST',
        body: args,
      });
      if (!newSession.id) {
        throw Error('errors.data-not-set');
      }
      void ctx.reply.setCookie('sessionId', newSession.id, {
        path: '/',
        secure: Config.NODE_ENV === 'production' ? true : false, // send cookie over HTTPS only
        domain: Config.COOKIE_DOMAIN,
        httpOnly: true,
        sameSite: true,
        expires: new Date(
          new Date().getTime() + Number(GlobalConfig.USER_SESSION_EXPIRE_IN_HOURS) * 60 * 60 * 1000,
        ),
      });
      return newSession;
    } catch (error) {
      return handleError(error);
    }
  },
  updateUser: async (_obj: unknown, args: { input: User }, ctx: MercuriusContext) => {
    try {
      await authorization(ctx.reply.request, [UserRole.ROLE_ADMIN]);
      assertIsDefined(args.input.id);
      const user = await apiRequest<User>({
        serviceUrl: Config.USERS_SERVICE_URI,
        api: `users/${args.input.id}`,
        method: 'PUT',
        body: args.input,
      });
      return user;
    } catch (error) {
      return handleError(error);
    }
  },
  toggleUser: async (_obj: unknown, args: { id: string }, ctx: MercuriusContext) => {
    try {
      await authorization(ctx.reply.request, [UserRole.ROLE_ADMIN]);
      const user = await apiRequest<UserSession>({
        serviceUrl: Config.USERS_SERVICE_URI,
        api: `users/${args.id}/toggle`,
        method: 'PATCH',
      });
      return user;
    } catch (error) {
      return handleError(error);
    }
  },
};
