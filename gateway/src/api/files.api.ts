import { FastifyInstance } from 'fastify';
import { GlobalConfig } from '../../../@types/config.enum.js';
import { CloudFile, FileType } from '../../../@types/files.type.js';
import { Config } from '../config.js';
import { apiRequest } from '../utils/api.util.js';
import { authorization } from '../utils/auth.util.js';
import { handleError } from '../utils/error.util.js';

export const filesApi = (app: FastifyInstance) => {
  void app.post<{
    Reply: CloudFile[] | Error;
    Querystring: { targetId: string; type: FileType };
  }>('/api/files', async (request, reply) => {
    try {
      const { type, targetId } = request.query;
      await authorization(reply.request);

      const formData = new FormData();
      const files = await request.saveRequestFiles({
        limits: { fileSize: Number(GlobalConfig.MAX_FILE_SIZE) },
      });
      for await (const file of files) {
        const buffer = await file.toBuffer();
        const blob = new Blob([buffer], { type: file.mimetype });
        formData.append('file', blob, file.filename);
      }

      const response = await apiRequest<CloudFile[]>({
        serviceUrl: Config.FILES_SERVICE_URI,
        api: `files?targetId=${targetId}&type=${type}`,
        method: 'POST',
        body: formData,
        isFormData: true,
      });

      return reply.send(response);
    } catch (error) {
      return handleError(error);
    }
  });
};
