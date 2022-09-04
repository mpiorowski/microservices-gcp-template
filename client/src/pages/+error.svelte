<script lang="ts">
  import { page } from '$app/stores';
  import { t } from 'svelte-i18n';
  console.error($page.error);
</script>

<div class="slot">
  <h1 class="p-4">{$t('errors.something-went-wrong')}</h1>
  <h2 class="p-4">
    <pre>{JSON.stringify($page.error, undefined, 2)}</pre>
  </h2>
</div>
