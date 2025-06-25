import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createInvestmentSchema,
  CreateInvestmentFormValues,
} from '@/lib/schemas/investment.schema';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';

// We need a more detailed type for displaying the investor list
type InvestmentWithInvestorDetails = {
  id: string;
  amount: number;
  equityPercentage: number;
  user: {
    id: string;
    email: string;
    profile: {
      name: string | null;
    } | null;
  };
};

export const useInvestments = (projectId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['investments', projectId];
  const [isModalOpen, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const form = useForm<CreateInvestmentFormValues>({
    resolver: zodResolver(createInvestmentSchema),
  });

  const { data: investments, isLoading } = useQuery<
    InvestmentWithInvestorDetails[]
  >({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<InvestmentWithInvestorDetails[]>(
        `/investments?projectId=${projectId}`
      );
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateInvestmentFormValues) =>
      api.post('/investments', { ...data, projectId }),
    onSuccess: () => {
      notifications.show({
        color: 'teal',
        title: 'Success',
        message: 'Investor has been successfully invited.',
      });
      queryClient.invalidateQueries({ queryKey });
      form.reset();
      closeModal();
    },
    onError: (error: any) => {
      notifications.show({
        color: 'red',
        title: 'Invitation Failed',
        message: error.response?.data?.message || 'An error occurred.',
      });
    },
  });

  return {
    investments,
    isLoading,
    form,
    isCreating: mutation.isPending,
    onSubmit: form.handleSubmit((data) => mutation.mutate(data)),
    isModalOpen,
    openModal,
    closeModal,
  };
};
