import type { MercuriusContext } from 'mercurius';
import { Config } from '../config.js';
import { apiRequest } from '../utils/api.util.js';
import { authorization } from '../utils/auth.util.js';
import { handleError } from '../utils/error.util.js';

export const filesQuery = {
  files: async (_obj: unknown, args: { targetId: string | null }, ctx: MercuriusContext) => {
    try {
      await authorization(ctx.reply.request);
      const { targetId } = args;
      const files = await apiRequest({
        serviceUrl: Config.FILES_SERVICE_URI,
        api: `files?targetId=${targetId ?? ''}`,
        method: 'GET',
      });
      return files;
    } catch (error) {
      return handleError(error);
    }
  },
};
