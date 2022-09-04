<script lang="ts">
  import { goto } from '$app/navigation';
  import { Dropdown } from '@mpiorowski/svelte-init';
  import { getContextClient } from '@urql/svelte';
  import type { OperationResultStore } from '@urql/svelte/dist/types/common';
  import { t } from 'svelte-i18n';
  import { UserRole } from '../../../@types/users.type';
  import { handleError } from '../@utils/error.util';
  import { userStore } from '../@utils/store.util';
  import Avatar from '../icons/avatar.svelte';
  import { authGql, logoutGql } from '../pages/auth/auth.graphql';

  const client = getContextClient();
  let response: OperationResultStore | undefined;
  const handleLogout = () => {
    try {
      response = logoutGql(client);
    } catch (error) {
      handleError(error);
    }
  };

  $: if ($response?.data) {
    authGql(client);
  }
</script>

<Dropdown>
  <svelte:fragment slot="button">
    <div class="w-8 h-8 hover:cursor-pointer hover:opacity-50 transition-all">
      <Avatar />
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="flex flex-col">
      <div class="text-gray-50 p-2 mt-2 border-b border-gray-400 text-sm">
        {$userStore?.email}
      </div>
      {#if $userStore?.role === UserRole.ROLE_ADMIN}
        <div
          role="button"
          class="text-gray-50 p-2 mt-2 hover:bg-slate-400 hover:cursor-pointer"
          on:click={() => goto('/settings')}
        >
          {$t('settings.settings')}
        </div>
      {/if}
      <div class="divider" />
      <div
        role="button"
        class="text-gray-50 text-sm p-2 mb-2 border-slate-400 hover:bg-slate-400 hover:cursor-pointer"
        on:click={handleLogout}
      >
        {$t('auth.logout')}
      </div>
    </div>
  </svelte:fragment>
</Dropdown>
