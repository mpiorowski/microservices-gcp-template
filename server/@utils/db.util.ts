import pkg from 'pg';
const { Pool, types } = pkg;

types.setTypeParser(1700, 'text', parseFloat);

// TODO - wrap whole service in this transaction
export async function db<T extends pkg.QueryResultRow>(
  query: string,
  variables: unknown[],
): Promise<T[]> {
  const pool = new Pool({ connectionString: process.env.POSTGRES });
  const client = await pool.connect();
  console.info('Query', query);
  console.info('Variables', variables);
  try {
    await client.query('BEGIN');
    const res = await client.query<T>(query, [...variables]);
    await client.query('COMMIT');
    return res.rows;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    void pool.end();
  }
}
