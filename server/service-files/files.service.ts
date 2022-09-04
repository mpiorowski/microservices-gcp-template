import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import type { FastifyInstance } from 'fastify';
import fs from 'fs';
import { z } from 'zod';
import { GlobalConfig } from '../../@types/config.enum.js';
import { Errors } from '../../@types/errors.enum.js';
import { CloudFile, FileType } from '../../@types/files.type.js';
import { customError } from '../@utils/error.util.js';
import { Config } from './config.js';
import { deleteFile, insertFile, selectAllFilesByTargetId } from './files.db.js';

const storage = new Storage();

const createFileUrl = (targetId: string, id: string, filename: string) => {
  return targetId + '/' + id + '/' + filename;
};

export const filesService = (app: FastifyInstance) => {
  void app.get<{
    Querystring: { targetId: string };
    Reply: CloudFile[];
  }>('/files', async (request, reply) => {
    const { targetId } = request.query;
    z.string().uuid().parse(targetId);

    const files = await selectAllFilesByTargetId(targetId);

    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 60 minutes
    };

    const bucketName = Config.BUCKET_NAME;
    let url;
    const promises = files.map(async (file) => {
      const fileUrl = createFileUrl(file.targetId, file.id, file.filename);
      if (Config.NODE_ENV === 'production') {
        [url] = await storage.bucket(bucketName).file(fileUrl).getSignedUrl(options);
      } else {
        url = 'https://test-file.pdf';
      }
      console.info(`${fileUrl} created url from ${bucketName}`);
      return { ...file, url };
    });

    const response = await Promise.all(promises);
    return reply.send(response);
  });

  void app.get<{ Params: CloudFile; Reply: { buffer: Buffer } }>(
    '/files/:targetId/:id/:filename',
    async (request, reply) => {
      const { targetId, id, filename } = request.params;
      z.object({
        targetId: z.string().uuid(),
        id: z.string().uuid(),
        filename: z.string().min(1),
      }).parse({ targetId, id, filename });

      const bucketName = Config.BUCKET_NAME;
      const fileUrl = createFileUrl(targetId, id, filename);
      let contents;
      if (Config.NODE_ENV === 'production') {
        [contents] = await storage.bucket(bucketName).file(fileUrl).download();
      } else {
        contents = fs.readFileSync('./pdf-test.pdf');
      }

      console.info(`${fileUrl} downloaded from ${bucketName}`);

      return reply.send({ buffer: contents });
    },
  );

  void app.post<{
    Reply: CloudFile[];
    Querystring: { targetId: string; type: FileType };
  }>('/files', async (request, reply) => {
    const { targetId, type } = request.query;
    z.object({ targetId: z.string().uuid(), type: z.nativeEnum(FileType) }).parse({
      targetId,
      type,
    });

    const bucketName = Config.BUCKET_NAME;
    const files = await request.saveRequestFiles({
      limits: { fileSize: Number(GlobalConfig.MAX_FILE_SIZE) },
    });
    if (files.length < 0) {
      throw customError(Errors.DATA_NOT_FOUND, 404);
    }

    const promises = files.map(async (file) => {
      const filename = file.filename;
      const filePath = file.filepath;

      const newFile = await insertFile(filename, targetId, type);
      if (!newFile[0]) {
        throw customError(Errors.DATA_NOT_CREATED, 404);
      }
      const fileUrl = createFileUrl(newFile[0].targetId, newFile[0].id, newFile[0].filename);

      if (Config.NODE_ENV === 'production') {
        await storage.bucket(Config.BUCKET_NAME).upload(filePath, {
          destination: fileUrl,
        });
      }
      console.info(`${fileUrl} uploaded to ${bucketName}`);
      return newFile[0];
    });
    const response = await Promise.all(promises);

    return reply.send(response);
  });

  void app.delete<{ Params: CloudFile }>(
    '/files/:targetId/:id/:filename',
    async (request, reply) => {
      const { targetId, id, filename } = request.params;
      z.object({
        targetId: z.string().uuid(),
        id: z.string().uuid(),
        filename: z.string().min(1),
      }).parse({ targetId, id, filename });

      const bucketName = Config.BUCKET_NAME;
      const fileUrl = createFileUrl(targetId, id, filename);

      const response = await deleteFile(id, filename);
      if (!response[0]) {
        throw customError(Errors.DATA_NOT_DELETED, 409);
      }

      if (Config.NODE_ENV === 'production') {
        await storage.bucket(bucketName).file(fileUrl).delete();
      }

      console.info(`${fileUrl} deleted from ${bucketName}`);

      return reply.send(response[0]);
    },
  );
};
