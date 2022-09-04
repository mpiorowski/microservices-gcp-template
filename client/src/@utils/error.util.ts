import { goto } from '$app/navigation';
import { toast, ToastType } from '@mpiorowski/svelte-init';
import { CombinedError } from '@urql/core';
import { Config } from '../config';
import { isAuth } from './store.util';

export type PathError = Record<string, string>;
export type ZodError = { code: string; path: [string] };

export const handleError = (error: unknown): PathError => {
  const pathError: PathError = {};
  if (error === undefined || error === null) {
    return pathError;
  }
  if (Config.VITE_NODE_ENV === 'development') {
    console.error(error);
  }
  if (error instanceof CombinedError) {
    error.graphQLErrors.forEach((err) => {
      if (error.message.includes('path') && error.message.includes('code')) {
        const zodMessage = JSON.parse(err.message) as ZodError[];
        zodMessage.forEach((zod) => {
          pathError[zod.path[0]] = `errors.${zod.code}`;
        });
      } else {
        toast(err.message, ToastType.ERROR, 4000);
        if ('statusCode' in err.extensions && err.extensions.statusCode === 401) {
          isAuth.set(false);
          void goto('/');
        }
      }
    });
  } else {
    toast('errors.something-went-wrong', ToastType.ERROR, 4000);
  }
  return pathError;
};
