import type { FastifyRequest } from 'fastify';
import { UserRole, UserSession } from '../../../@types/users.type.js';
import { Config } from '../config.js';
import { apiRequest } from './api.util.js';
import { customError } from './error.util.js';

export const authorization = async (
  request: FastifyRequest,
  role?: UserRole[],
): Promise<UserSession> => {
  try {
    if (!request.cookies.sessionId) {
      throw Error();
    }
    const userSession = await apiRequest<UserSession>({
      serviceUrl: Config.USERS_SERVICE_URI,
      api: `sessions/${request.cookies.sessionId}`,
      method: 'GET',
    });

    if (!userSession.id) {
      throw Error();
    }

    if (role && !role.includes(userSession.role)) {
      throw Error();
    }
    return userSession;
  } catch {
    throw customError('errors.user-session-expired', 401);
  }
};
