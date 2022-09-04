import { CloudFile } from '../../../@types/files.type.js';
import { Config } from '../config.js';
import { apiRequest } from '../utils/api.util.js';
import { handleError } from '../utils/error.util.js';

export const getFileLoader: (id: string, filename: string) => Promise<CloudFile> = async (
  id: string,
  filename: string,
) => {
  try {
    const file = await apiRequest<CloudFile>({
      serviceUrl: Config.FILES_SERVICE_URI,
      api: `files-url/${id}/${filename}`,
      method: 'GET',
    });
    return file;
  } catch (error) {
    return handleError(error);
  }
};
