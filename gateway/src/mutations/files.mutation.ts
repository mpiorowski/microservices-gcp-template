import { MercuriusContext } from 'mercurius';
import { CloudFile } from '../../../@types/files.type.js';
import { Config } from '../config.js';
import { apiRequest } from '../utils/api.util.js';
import { authorization } from '../utils/auth.util.js';
import { handleError } from '../utils/error.util.js';

export const filesMutation = {
  deleteFile: async (
    _obj: unknown,
    args: { targetId: string; fileId: string; filename: string },
    ctx: MercuriusContext,
  ) => {
    try {
      // TODO - authorized depending on file type
      await authorization(ctx.reply.request);
      const file = await apiRequest<CloudFile>({
        serviceUrl: Config.FILES_SERVICE_URI,
        api: `files/${args.targetId}/${args.fileId}/${args.filename}`,
        method: 'DELETE',
      });
      return file;
    } catch (error) {
      return handleError(error);
    }
  },
};
