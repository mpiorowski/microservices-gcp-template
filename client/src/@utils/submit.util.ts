import type { Client } from '@urql/svelte';
import type { OperationResultStore } from '@urql/svelte/dist/types/common';
import { writable } from 'svelte/store';
import { handleError, type PathError } from './error.util';

export const useSubmit = <T>() => {
  const errors = writable<PathError>({});
  const submitting = writable(false);
  let response: OperationResultStore<T, object> | undefined;

  type Submit<D> = {
    client: Client;
    request: D;
    mutation: (client: Client, variables: D) => OperationResultStore<T, object>;
    toast?: () => void;
    onClose?: () => void;
  };
  const submit = <D>({ client, request, mutation, toast, onClose }: Submit<D>) => {
    submitting.set(true);
    response = mutation(client, request);
    response.subscribe(($) => {
      if ($.error) {
        errors.set(handleError($.error));
        submitting.set(false);
      } else if ($.data) {
        toast?.();
        onClose?.();
        submitting.set(false);
      }
    });
    return response;
  };

  const resetErrors = () => {
    errors.set({});
  };

  return { submit, errors, response, resetErrors, submitting };
};
