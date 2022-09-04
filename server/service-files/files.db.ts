import { CloudFile, FileType } from '../../@types/files.type.js';
import { db } from '../@utils/db.util.js';

export const selectAllFiles = async (): Promise<CloudFile[]> => {
  const queryText = 'select * from files order by created desc';
  const response = await db<CloudFile>(queryText, []);
  return response;
};

export const selectAllFilesByTargetId = async (targetId: string): Promise<CloudFile[]> => {
  const queryText = 'select * from files where "targetId" = $1 order by created desc';
  const response = await db<CloudFile>(queryText, [targetId]);
  return response;
};

export const selectFileById = async (id: string): Promise<CloudFile[]> => {
  const queryText = 'select * from files where id = $1';
  const response = await db<CloudFile>(queryText, [id]);
  return response;
};
export const selectAllFilesByUserId = async (id: string): Promise<CloudFile[]> => {
  const queryText = 'select * from files where "userId" = $1 order by created desc';
  const response = await db<CloudFile>(queryText, [id]);
  return response;
};

export const insertFile = async (
  filename: string,
  targetId: string,
  type: FileType | null,
): Promise<CloudFile[]> => {
  const queryText =
    'insert into files ("filename", "targetId", "type") values ($1, $2, $3) returning *';
  const response = await db<CloudFile>(queryText, [filename, targetId, type]);
  return response;
};

export const deleteFile = async (id: string, filename: string): Promise<CloudFile[]> => {
  const queryText = 'delete from files where id = $1 and filename = $2 returning *';
  const response = await db<CloudFile>(queryText, [id, filename]);
  return response;
};
