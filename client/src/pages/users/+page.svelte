<script lang="ts">
  import { Button, Table } from '@mpiorowski/svelte-init';
  import { getContextClient } from '@urql/svelte';
  import { handleError } from 'src/@utils/error.util';
  import { t } from 'svelte-i18n';
  import MenuDropdown from '../../@components/menuDropdown.svelte';
  import UserFiles from './userFiles.drawer.svelte';
  import { selectAllUsersGql } from './users.graphql';

  const client = getContextClient();
  const users = selectAllUsersGql(client);
  $: if ($users.error) {
    handleError($users.error);
  }

  let isOpen = false;
  let userId: null | string = null;
</script>

<UserFiles {isOpen} onClose={() => (isOpen = !isOpen)} {userId} />

<div class="slot">
  <div class="title">
    <h1>{$t('users.users')}</h1>
    <div />
    <MenuDropdown />
  </div>
  <div class="content">
    <Table>
      <svelte:fragment slot="header">
        <tr>
          <th scope="col">{$t('common.email')}</th>
          <th scope="col">{$t('auth.role')}</th>
          <th scope="col">{$t('auth.last-login')}</th>
          <th scope="col">{$t('common.actions')}</th>
        </tr>
      </svelte:fragment>
      <svelte:fragment slot="body">
        {#each $users.data?.users || [] as user}
          <tr>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.lastLogin}</td>
            <td>
              <Button
                on:click={() => {
                  userId = user.id;
                  isOpen = true;
                }}
              >
                {$t('common.files')}
              </Button>
            </td>
          </tr>
        {/each}
      </svelte:fragment>
    </Table>
  </div>
</div>
