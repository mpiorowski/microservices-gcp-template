import type { User } from '../../../@types/users.type.js';
import { db } from '../../@utils/db.util.js';

export async function selectUserById(userId: string): Promise<User[]> {
  const queryText = 'select * from users where "id" = $1';
  return await db<User>(queryText, [userId]);
}

export async function selectUserByEmail(email: string): Promise<User[]> {
  const queryText = 'select * from users where email = $1';
  return await db<User>(queryText, [email]);
}

export async function selectAllUsers(): Promise<User[]> {
  const queryText = 'select * from users order by created desc';
  return await db<User>(queryText, []);
}

export const upsertUser = async (user: Omit<User, 'id'>): Promise<User[]> => {
  const queryText = `insert into users (email, role) values ($1, $2) 
    on conflict (email) do update set email = $1, role = $2 returning *`;
  return await db<User>(queryText, [user.email, user.role]);
};

export async function insertUser(user: Omit<User, 'id'>): Promise<User[]> {
  const queryText = 'insert into users (email, role) VALUES ($1, $2) returning *';
  return await db<User>(queryText, [user.email, user.role]);
}

export async function updateUser(user: User): Promise<User[]> {
  const queryText = 'update users set email = $1, role = $2 where id = $3 returning *';
  return await db<User>(queryText, [user.email, user.role, user.id]);
}

export async function updateUserLastLogin(userId: string): Promise<User[]> {
  const queryText = 'update users set "lastLogin" = now() where id = $1 returning *';
  return await db<User>(queryText, [userId]);
}

export async function toggleUser(userId: string): Promise<User[]> {
  const queryText = `
  update users set 
  active = NOT active
  where id = $1
  returning *`;
  return await db<User>(queryText, [userId]);
}
