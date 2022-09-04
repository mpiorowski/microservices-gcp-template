import { filesMutation } from './mutations/files.mutation.js';
import { usersMutation } from './mutations/users.mutation.js';
import { filesQuery } from './query/files.query.js';
import { usersQuery } from './query/users.query.js';

export const resolvers = {
  Query: {
    ...filesQuery,
    ...usersQuery,
  },
  Mutation: {
    ...filesMutation,
    ...usersMutation,
  },
};
