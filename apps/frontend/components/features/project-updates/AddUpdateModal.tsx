'use client';

import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { UseFormReturn } from 'react-hook-form';
import { CreateUpdateFormValues } from '@/lib/schemas/updates.schema';

interface AddUpdateModalProps {
  opened: boolean;
  onClose: () => void;
  form: UseFormReturn<CreateUpdateFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isCreating: boolean;
}

export function AddUpdateModal({
  opened,
  onClose,
  form,
  onSubmit,
  isCreating,
}: AddUpdateModalProps) {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <Modal opened={opened} onClose={onClose} title="Post a New Update" centered>
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput
            label="Title"
            required
            {...register('title')}
            error={errors.title?.message}
          />
          <Textarea
            label="Content"
            required
            minRows={5}
            {...register('content')}
            error={errors.content?.message}
          />
          {/* TODO: Add attachment upload field */}
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating}>
              Post Update
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
