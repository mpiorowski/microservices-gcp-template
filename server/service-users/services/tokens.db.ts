import type { Token, TokenType } from '../../../@types/users.type.js';
import { db } from '../../@utils/db.util.js';

export async function selectToken(code: string, type: TokenType, email: string) {
  const queryText =
    'select * from tokens where code = $1 and type = $2 and email = $3 and expires > now() order by created desc limit 1';
  const response = await db<Token>(queryText, [code, type, email]);
  return response;
}

export async function insertToken(code: string, type: TokenType, email: string) {
  const queryText =
    "insert into tokens (code, type, email, expires) values ($1, $2, $3, now() + interval '5 minutes') returning *";
  const response = await db<Token>(queryText, [code, type, email]);
  return response;
}
