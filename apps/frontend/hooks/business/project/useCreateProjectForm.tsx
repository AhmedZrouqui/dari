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

// The API function that will be called
const createProject = async (
  data: CreateProjectFormValues
): Promise<Project> => {
  const response = await api.post<Project>('/projects', data);

  return response.data;
};

export const useCreateProjectForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      notifications.show({
        title: 'Project Created',
        message: `The project "${newProject.name}" has been successfully created.`,
        color: 'teal',
      });
      // Invalidate the 'projects' query to refetch the list on the dashboard
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      router.push('/dashboard');
    },
    onError: (error) => {
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || 'Failed to create project.';
      }
      notifications.show({
        title: 'Creation Failed',
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
