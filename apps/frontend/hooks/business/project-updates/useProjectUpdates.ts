import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ProjectUpdateWithAuthor } from '@dari/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUpdateSchema,
  CreateUpdateFormValues,
} from '@/lib/schemas/updates.schema';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';

const fetchUpdates = async (
  projectId: string
): Promise<ProjectUpdateWithAuthor[]> => {
  const { data } = await api.get<ProjectUpdateWithAuthor[]>(
    `/updates?projectId=${projectId}`
  );

  return data;
};

const createUpdate = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: CreateUpdateFormValues;
}) => {
  const response = await api.post('/updates', { ...data, projectId });
  return response.data;
};

export const useProjectUpdates = (projectId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['updates', projectId];
  const [isModalOpen, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const form = useForm<CreateUpdateFormValues>({
    resolver: zodResolver(createUpdateSchema),
  });

  const { data: updates, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchUpdates(projectId),
  });

  const mutation = useMutation({
    mutationFn: (data: CreateUpdateFormValues) =>
      createUpdate({ projectId, data }),
    onSuccess: () => {
      notifications.show({
        color: 'teal',
        title: 'Update Posted',
        message: 'Your update has been successfully posted.',
      });
      queryClient.invalidateQueries({ queryKey });
      form.reset();
      closeModal(); // THE FIX: Close the modal on successful submission
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Failed to post update.',
      });
    },
  });

  return {
    updates,
    isLoading,
    form,
    isCreating: mutation.isPending,
    onSubmit: form.handleSubmit((data) => mutation.mutate(data)),
    // Modal state and handlers are now controlled by the hook
    isModalOpen,
    openModal,
    closeModal,
  };
};
