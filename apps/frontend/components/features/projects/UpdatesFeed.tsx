import {
  Paper,
  Title,
  Button,
  Group,
  Stack,
  Alert,
  Center,
  Loader,
} from '@mantine/core';
import { Plus, MessageSquare } from 'lucide-react';
import { useProjectUpdates } from '@/hooks/business/project-updates/useProjectUpdates';
import { AddUpdateModal } from '../project-updates/AddUpdateModal';
import UpdateCard from '../project-updates/UpdateCard';

export function UpdatesFeed({ projectId }: { projectId: string }) {
  const {
    updates,
    isLoading,
    form,
    isCreating,
    onSubmit,
    isModalOpen,
    openModal,
    closeModal,
  } = useProjectUpdates(projectId);

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <AddUpdateModal
        opened={isModalOpen}
        onClose={closeModal}
        form={form}
        onSubmit={onSubmit}
        isCreating={isCreating}
      />
      <Paper withBorder p="xl" radius="md" h="100%">
        <Group justify="space-between" mb="xl">
          <Title order={3}>Recent Updates</Title>
          <Button
            onClick={openModal}
            leftSection={<Plus size={16} />}
            variant="light"
          >
            Post Update
          </Button>
        </Group>

        {updates && updates.length > 0 ? (
          <Stack>
            {updates.map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </Stack>
        ) : (
          <Alert icon={<MessageSquare size={16} />} title="No Updates Yet">
            There are no updates for this project. Be the first to post one!
          </Alert>
        )}
      </Paper>
    </>
  );
}
