import { Client, gql, mutationStore, queryStore } from '@urql/svelte';
import type { TokenType, UserSession } from '../../../../@types/users.type';

export const authGql = (client: Client) =>
  queryStore<{ userSession: UserSession }>({
    client: client,
    query: gql`
      query {
        userSession {
          id
          user {
            email
            id
            role
            active
          }
        }
      }
    `,
  });

export const logoutGql = (client: Client) =>
  mutationStore({
    client: client,
    query: gql`
      mutation {
        logout
      }
    `,
  });

export const sendToken = (client: Client, variables: { email: string; type: TokenType }) =>
  mutationStore({
    client: client,
    query: gql`
      mutation ($email: String!, $type: String!) {
        sendToken(email: $email, type: $type)
      }
    `,
    variables: variables,
  });

export const insertUserSessionGql = (client: Client, variables: { email: string; token: string }) =>
  mutationStore<UserSession>({
    client: client,
    query: gql`
      mutation ($email: String!, $token: String!) {
        insertUserSession(email: $email, token: $token) {
          id
          user {
            id
            email
            role
            active
          }
        }
      }
    `,
    variables: variables,
  });
