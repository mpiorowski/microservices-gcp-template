<script lang="ts">
  import { Button, Input, toast, ToastType } from '@mpiorowski/svelte-init';
  import { getContextClient } from '@urql/svelte';
  import { t } from 'svelte-i18n';
  import { TokenType } from '../../../../@types/users.type';
  import { handleError } from '../../@utils/error.util';
  import { useSubmit } from '../../@utils/submit.util';
  import { sendToken } from './auth.graphql';

  let email = '';
  let isSend = false;
  const client = getContextClient();

  let { submit, errors, submitting } = useSubmit();

  const handleSubmit = () => {
    submitting.set(true);
    const request = { email, type: TokenType.MAGIC_LINK };
    try {
      submit({
        client,
        request,
        mutation: sendToken,
        toast: () => toast($t('auth.send-email'), ToastType.SUCCESS),
      });
      window.localStorage.setItem('email', email);
      isSend = true;
    } catch (error) {
      handleError(error);
    }
    submitting.set(false);
  };
</script>

<svelte:head>
  <title>Login</title>
  <meta name="description" content="Login" />
</svelte:head>

<div class="h-screen w-screen flex flex-col items-center justify-center">
  {#if !isSend}
    <form
      on:submit|preventDefault={handleSubmit}
      class="grid gap-2 max-w-lg w-full rounded-md px-10 py-6"
      id="login"
    >
      <Input
        bind:value={email}
        type="email"
        name="email"
        label={$t('common.email')}
        error={$t($errors.email ?? '')}
      />
      <Button type="primary" form="login" loading={$submitting}>
        {$t('auth.sign-in-using-email')}
      </Button>
    </form>
  {:else}
    <div class="w-full max-w-lg px-10 py-6 text-center">
      <h2 class="h-32 flex items-center">
        {$t('auth.check-email')}
      </h2>
    </div>
  {/if}
</div>
