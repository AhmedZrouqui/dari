import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Milestone, MilestoneStatus } from '@dari/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addMilestoneSchema,
  AddMilestoneValues,
} from '@/lib/schemas/milestone.schema';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

export const useMilestones = (projectId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['milestones', projectId];

  const [isModalOpen, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<AddMilestoneValues>({
    resolver: zodResolver(addMilestoneSchema),
  });

  const { data: milestones, isLoading } = useQuery<Milestone[]>({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<Milestone[]>(
        `/milestones?projectId=${projectId}`
      );
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: MilestoneStatus;
    }) => {
      return api.patch(`/milestones/${id}`, { status });
    },
    // Using optimistic updates for a snappy UI
    onMutate: async (newMilestone) => {
      await queryClient.cancelQueries({ queryKey });
      const previousMilestones =
        queryClient.getQueryData<Milestone[]>(queryKey);
      queryClient.setQueryData<Milestone[]>(queryKey, (old) =>
        old?.map((m) =>
          m.id === newMilestone.id ? { ...m, status: newMilestone.status } : m
        )
      );
      return { previousMilestones };
    },
    onError: (err, newMilestone, context) => {
      notifications.show({
        color: 'red',
        title: 'Update Failed',
        message: 'Could not update status.',
      });
      queryClient.setQueryData(queryKey, context?.previousMilestones);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: AddMilestoneValues) => {
      return editingId
        ? api.patch(`/milestones/${editingId}`, data)
        : api.post('/milestones', { ...data, projectId });
    },
    onSuccess: () => {
      notifications.show({
        color: 'teal',
        title: 'Success',
        message: `Milestone ${editingId ? 'updated' : 'added'} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey });
      closeModal();
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'The operation failed.',
      });
    },
  });

  const handleOpenAddModal = () => {
    setEditingId(null);
    form.reset({ name: '', description: '', targetDate: undefined });
    openModal();
  };

  const handleOpenEditModal = (milestone: Milestone) => {
    setEditingId(milestone.id);
    form.reset({
      name: milestone.name,
      description: milestone.description || '',
      targetDate: milestone.targetDate
        ? new Date(milestone.targetDate)
        : undefined,
    });
    openModal();
  };

  return {
    milestones,
    isLoading,
    updateStatus: updateStatusMutation.mutate,
    form,
    isModalOpen,
    editingId,
    isSaving: saveMutation.isPending,
    handleOpenAddModal,
    handleOpenEditModal,
    closeModal,
    onSubmit: form.handleSubmit((data) => saveMutation.mutate(data)),
  };
};
