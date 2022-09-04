import { UserLoaders } from './loaders/users.loader.js';

export const loaders = {
  UserSession: {
    ...UserLoaders,
  },
};
