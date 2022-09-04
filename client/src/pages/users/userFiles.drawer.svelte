<script lang="ts">
  import { Drawer, toastDelete, toastSave } from '@mpiorowski/svelte-init';
  import { assertIsDefined } from '@mpiorowski/utils';
  import { getContextClient } from '@urql/svelte';
  import Files from 'src/@components/files.svelte';
  import { handleError } from 'src/@utils/error.util';
  import { deleteFileGql, insertFile, selectAllFilesGql } from 'src/@utils/files.util';
  import { useSubmit } from 'src/@utils/submit.util';
  import { t } from 'svelte-i18n';
  import { FileType, type CloudFile } from 'types/files.type';

  export let isOpen: boolean;
  export let userId: string | null;
  export let onClose: () => void;

  const client = getContextClient();
  $: files = selectAllFilesGql(client, { targetId: userId });

  if ($files?.error) {
    handleError($files.error);
  }

  const onSave = async (fileList: FileList) => {
    submitting.set(true);
    try {
      assertIsDefined(userId);
      await insertFile(fileList, userId, FileType.INFO);
      toastSave();
      selectAllFilesGql(client, { targetId: userId });
    } catch (error) {
      handleError(error);
    }
    submitting.set(false);
  };

  const { submit, submitting } = useSubmit();
  const onDelete = (file: CloudFile) => {
    assertIsDefined(userId);
    submit({
      client,
      mutation: deleteFileGql,
      request: { targetId: file.targetId, fileId: file.id, filename: file.filename },
      toast: toastDelete,
    });
  };
</script>

<Drawer {isOpen} {onClose} title={$t('common.files')}>
  <svelte:fragment slot="content">
    <Files existingFiles={$files.data?.files || []} {onSave} {onDelete} submitting={$submitting} />
  </svelte:fragment>
</Drawer>
