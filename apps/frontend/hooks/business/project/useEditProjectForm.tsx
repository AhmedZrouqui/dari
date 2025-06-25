'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '@/lib/api';
import {
  CreateProjectFormValues,
  createProjectSchema,
} from '@/lib/schemas/project.schema';
import { Project } from '@dari/types';

const updateProject = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: CreateProjectFormValues;
}): Promise<Project> => {
  const response = await api.patch<Project>(`/projects/${projectId}`, data);

  return response.data;
};

export const useEditProjectForm = (projectId: string, initialData: Project) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description || '',
      totalBudget: Number(initialData.totalBudget),
      expectedCompletion: initialData.expectedCompletion
        ? new Date(initialData.expectedCompletion)
        : undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateProjectFormValues) =>
      updateProject({ projectId, data }),
    onSuccess: (updatedProject) => {
      notifications.show({
        title: 'Project Updated',
        message: `The project "${updatedProject.name}" has been successfully updated.`,
        color: 'teal',
      });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      router.push(`/projects/${projectId}`);
    },
    onError: (error) => {
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || 'Failed to update project.';
      }
      notifications.show({
        title: 'Update Failed',
        message: errorMessage,
        color: 'red',
      });
    },
  });

  const onSubmit = (data: CreateProjectFormValues) => {
    mutation.mutate(data);
  };

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting: mutation.isPending,
    onSubmit,
  };
};
