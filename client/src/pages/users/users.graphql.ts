import { gql, queryStore, type Client } from '@urql/svelte';
import type { User } from '../../../../@types/users.type';

export const selectAllUsersGql = (client: Client) =>
  queryStore<{ users: User[] }>({
    client: client,
    query: gql`
      query {
        users {
          id
          email
          role
          lastLogin
        }
      }
    `,
    context: {
      additionalTypenames: ['User'],
    },
  });
