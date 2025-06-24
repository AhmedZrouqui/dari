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

export const useMilestonesForm = (projectId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['milestones', projectId];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMilestoneValues>({
    resolver: zodResolver(addMilestoneSchema),
  });

  // 1. Fetching Logic
  const { data: milestones, isLoading } = useQuery({
    queryKey,
    queryFn: async (): Promise<Milestone[]> => {
      const { data } = await api.get<Milestone[]>(
        `/milestones?projectId=${projectId}`
      );
      return data;
    },
  });

  // 2. Update Logic (with Optimistic Update)
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: MilestoneStatus;
    }) => {
      return api.patch(`/milestones/${id}`, { status });
    },
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
        message: 'Could not update milestone status.',
      });
      queryClient.setQueryData(queryKey, context?.previousMilestones);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // 3. Creation Logic
  const createMutation = useMutation({
    mutationFn: async (newName: string) => {
      return api.post('/milestones', { name: newName, projectId });
    },
    onSuccess: () => {
      notifications.show({
        color: 'teal',
        title: 'Milestone Added',
        message: 'New milestone has been added to the timeline.',
      });
      reset();
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Creation Failed',
        message: 'Could not add the new milestone.',
      });
    },
  });

  const handleCreateMilestone = (data: AddMilestoneValues) => {
    createMutation.mutate(data.name);
  };

  return {
    milestones,
    isLoading,
    updateStatus: updateMutation.mutate,
    // Form related exports
    register,
    handleSubmit: handleSubmit(handleCreateMilestone),
    errors,
    isCreating: createMutation.isPending,
  };
};
