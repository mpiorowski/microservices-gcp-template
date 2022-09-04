<script lang="ts">
  import { Spinner } from '@mpiorowski/svelte-init';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { getContextClient } from '@urql/svelte';
  import { useSubmit } from '../../@utils/submit.util.js';
  import { authGql, insertUserSessionGql } from './auth.graphql.js';
  import { handleError } from '../../@utils/error.util.js';
  import type { UserSession } from '../../../../@types/users.type.js';

  const context = getContextClient();
  const token = $page.url.searchParams.get('token');
  const email = browser && window.localStorage.getItem('email');

  $: if (browser && (!token || !email)) {
    void goto('/');
  }

  const client = getContextClient();
  let { submit, response } = useSubmit<UserSession>();

  $: if (browser && token && email) {
    const request = { email, token };
    try {
      response = submit({ client, request, mutation: insertUserSessionGql });
    } catch (error) {
      handleError(error);
    }
  }

  $: if ($response?.data) {
    window.localStorage.removeItem('email');
    authGql(context);
  }

  $: if ($response?.error) {
    void goto('/');
  }
</script>

<Spinner center size={40} />
