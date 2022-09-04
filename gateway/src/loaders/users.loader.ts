import type { User, UserSession } from '../../../@types/users.type.js';
import { Config } from '../config.js';
import { apiRequest } from '../utils/api.util.js';
import { handleError } from '../utils/error.util.js';

export const UserLoaders = {
  async user(queries: { obj: UserSession }[]) {
    const data: Promise<User>[] = [];
    queries.forEach((query) => {
      const user = getUserLoader(query.obj.userId);
      data.push(user);
    });
    return Promise.all(data);
  },
};

export const getUserLoader: (userId: string) => Promise<User> = async (userId: string) => {
  try {
    const user = await apiRequest<User>({
      serviceUrl: Config.USERS_SERVICE_URI,
      api: `users/${userId}`,
      method: 'GET',
    });
    return user;
  } catch (error) {
    return handleError(error);
  }
};

export const selectAllUsersLoader = async () => {
  try {
    const user = await apiRequest<User[]>({
      serviceUrl: Config.USERS_SERVICE_URI,
      api: 'users',
      method: 'GET',
    });
    return user;
  } catch (error) {
    return handleError(error);
  }
};
