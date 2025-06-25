'use client';

import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { UseFormReturn } from 'react-hook-form';
import { AddMilestoneValues } from '@/lib/schemas/milestone.schema';
import { Controller } from 'react-hook-form';

interface MilestoneModalProps {
  opened: boolean;
  onClose: () => void;
  form: UseFormReturn<AddMilestoneValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSaving: boolean;
  editingId: string | null;
}

export function MilestoneModal({
  opened,
  onClose,
  form,
  onSubmit,
  isSaving,
  editingId,
}: MilestoneModalProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const modalTitle = editingId ? 'Edit Milestone' : 'Add New Milestone';

  return (
    <Modal opened={opened} onClose={onClose} title={modalTitle} centered>
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput
            label="Milestone Name"
            required
            {...register('name')}
            error={errors.name?.message}
          />
          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
          />
          <Controller
            name="targetDate"
            control={control}
            render={({ field }) => (
              <DateInput
                {...field}
                value={field.value ?? null}
                label="Target Date"
                clearable
                error={errors.targetDate?.message}
              />
            )}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving}>
              {editingId ? 'Save Changes' : 'Add Milestone'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
