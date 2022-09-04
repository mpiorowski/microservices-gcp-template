<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { Spinner, Toast, Tooltip, useMediaQuery } from '@mpiorowski/svelte-init';
  import { createClient, setContextClient } from '@urql/svelte';
  import { isLoading as isLoadingi18n, t } from 'svelte-i18n';
  import { isAuth, userStore } from '../@utils/store.util';
  import '@mpiorowski/svelte-init/styles.css';
  import '../app.css';
  import { Config } from '../config';
  import '../i18n';
  import Login from './auth/login.svelte';
  import Token from './auth/token.svelte';
  import { browser } from '$app/environment';
  import { authGql } from './auth/auth.graphql';
  import type { UserRole } from '../../../@types/users.type';

  const context = createClient({
    url: `${Config.VITE_API_URL}/graphql`,
    fetchOptions: {
      credentials: 'include',
    },
    requestPolicy: 'cache-and-network',
  });
  $: setContextClient(context);

  const auth = authGql(context);
  let isLoading = !$isAuth || $auth.fetching;

  $: if (!$auth.fetching) {
    if ($auth.data?.userSession.user?.active) {
      isAuth.set(true);
      isLoading = false;
      userStore.set({
        id: $auth.data.userSession.user.id,
        email: $auth.data.userSession.user.email,
        role: $auth.data.userSession.user.role,
        active: $auth.data.userSession.user.active,
      });
      if ($page.url.pathname === '/token') {
        goto('/');
      }
    } else {
      isAuth.set(false);
      isLoading = false;
    }
  }

  const media = useMediaQuery(browser);

  const navs: {
    pathname: string;
    name: string;
    icon: string;
    role: UserRole | null;
  }[] = [
    {
      pathname: '/users',
      name: 'users.users',
      icon: 'fas fa-users fa-lg',
      role: null,
    },
  ];
</script>

<svelte:head>
  <title>Application</title>
  <meta name="description" content="Application" />
</svelte:head>

<Toast />
{#if $page.url.pathname === '/token'}
  <Token />
{:else if isLoading || $isLoadingi18n}
  <Spinner center size={40} />
{:else if !$isAuth}
  <Login />
{:else if $isAuth}
  <div class="h-screen">
    <div class="navigation">
      <img
        on:click={() => goto('/users')}
        class="w-9 h-9 mb-4 mt-1 hover:cursor-pointer hidden lg:flex"
        src="/favicon.ico"
        alt="logo"
      />
      {#each navs.filter((el) => !el.role || el.role === $userStore?.role) as nav}
        <Tooltip
          tooltip={$t(nav.name)}
          move={0.5}
          position={media.isMediaQueryLg ? 'right' : 'top'}
        >
          <a
            class="nav"
            class:active={$page.url.pathname.includes(nav.pathname)}
            href={nav.pathname}
            aria-label={nav.pathname}
          >
            <i class={nav.icon} />
          </a>
        </Tooltip>
      {/each}
    </div>
    <slot />
  </div>
{/if}
