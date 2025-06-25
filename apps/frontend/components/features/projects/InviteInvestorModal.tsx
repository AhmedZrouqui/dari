'use client';

import {
  Modal,
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { UseFormReturn } from 'react-hook-form';
import { CreateInvestmentFormValues } from '@/lib/schemas/investment.schema';
import { Controller } from 'react-hook-form';

interface InviteInvestorModalProps {
  opened: boolean;
  onClose: () => void;
  form: UseFormReturn<CreateInvestmentFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isCreating: boolean;
}

export function InviteInvestorModal({
  opened,
  onClose,
  form,
  onSubmit,
  isCreating,
}: InviteInvestorModalProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Invite New Investor"
      centered
    >
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput
            label="Investor Email"
            placeholder="investor@email.com"
            required
            {...register('investorEmail')}
            error={errors.investorEmail?.message}
          />
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Investment Amount (MAD)"
                placeholder="e.g., 500000"
                required
                thousandSeparator=","
                min={0}
                error={errors.amount?.message}
              />
            )}
          />
          <Controller
            name="equityPercentage"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Equity Percentage (%)"
                placeholder="e.g., 10"
                required
                min={0}
                max={100}
                error={errors.equityPercentage?.message}
              />
            )}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating}>
              Send Invitation
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
