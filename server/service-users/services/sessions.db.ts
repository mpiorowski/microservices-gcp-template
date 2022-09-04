import type { UserSession } from '../../../@types/users.type.js';
import { db } from '../../@utils/db.util.js';

export async function selectUserSessionById(sessionId: string): Promise<UserSession[]> {
  const queryText = 'select * from sessions where "id" = $1';
  const response = await db<UserSession>(queryText, [sessionId]);
  return response;
}

export async function insertUserSession(session: UserSession): Promise<UserSession[]> {
  const queryText =
    'insert into sessions ("userId", role, expires) VALUES ($1, $2, $3) returning *';
  const response = await db<UserSession>(queryText, [
    session.userId,
    session.role,
    session.expires,
  ]);
  return response;
}

export async function deleteUserSessionById(sessionId: string): Promise<UserSession[]> {
  const queryText = 'delete * from sessions where id = $1';
  const response = await db<UserSession>(queryText, [sessionId]);
  return response;
}
