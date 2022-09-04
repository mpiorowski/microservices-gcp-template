<script lang="ts">
  import { Button } from '@mpiorowski/svelte-init';
  import { t } from 'svelte-i18n';
  import type { CloudFile } from '../../../@types/files.type';

  export let onSave: (files: FileList) => Promise<void> | void;
  export let onDelete: (file: CloudFile) => void;
  export let existingFiles: CloudFile[];
  export let submitting: boolean;
  export let readonly = false;

  let confirmDelete = '';
  let files: FileList | undefined;
  let input: HTMLInputElement | undefined;
</script>

<div class="grid grid-cols-[1fr_auto] gap-2 justify-center items-center">
  {#if !readonly}
    <label
      class="border border-dashed border-gray-400 py-1 px-2 text-md font-bold rounded-md cursor-pointer text-center truncate"
    >
      {#if files?.length === 0 || !files}
        {$t('common.upload-files')}
      {:else if files.length > 0}
        {#each files as file}
          <p class="truncate">
            {file.name}
          </p>
        {/each}
      {/if}
      <input
        class="hidden"
        aria-describedby={'file-input'}
        type="file"
        multiple
        bind:files
        bind:this={input}
      />
    </label>
    <Button
      on:click={async () => {
        files && (await onSave(files));
        if (input) {
          input.value = '';
        }
      }}
      disabled={files?.length === 0 || input?.value === ''}
    >
      {#if submitting}
        <i class="fa-solid fa-spinner fa-spin-pulse" />
      {:else}
        <i class="fa-solid fa-square-plus" />
      {/if}
    </Button>
    <div class="col-span-2 text-xs">
      {$t('common.maxFileSize')}
    </div>
    {#each existingFiles as file}
      <a class="font-bold text-green-500 hover:underline" href={file.url} download={file.filename}>
        {file.filename}
      </a>
      {#if confirmDelete !== file.id}
        <Button type="error" on:click={() => (confirmDelete = file.id)}>
          {#if submitting}
            <i class="fa-solid fa-spinner fa-spin-pulse" />
          {:else}
            <i class="fa-solid fa-trash-can" />
          {/if}
        </Button>
      {/if}
      {#if confirmDelete === file.id}
        <Button type="error" on:click={() => onDelete(file)}>
          {#if submitting}
            <i class="fa-solid fa-spinner fa-spin-pulse" />
          {:else}
            <i class="fa-solid fa-square-check" />
          {/if}
        </Button>
      {/if}
    {/each}
  {:else}
    {#each existingFiles as file}
      <a
        class="font-bold text-green-600 hover:underline col-span-2"
        href={file.url}
        download={file.filename}
      >
        {file.filename}
      </a>
    {/each}
  {/if}
</div>
