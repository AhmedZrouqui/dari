'use client';

import {
  Paper,
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Title,
  Stack,
  Container,
  Group,
  Breadcrumbs,
  Anchor,
  Text,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Controller } from 'react-hook-form';
import Link from 'next/link';
import { useCreateProjectForm } from '@/hooks/business/project/useCreateProjectForm';
import { Building, Calendar, Plus, Save } from 'lucide-react';

export default function NewProjectPage() {
  const { control, register, handleSubmit, errors, isSubmitting, onSubmit } =
    useCreateProjectForm();

  const breadcrumbItems = [
    { title: 'Projects', href: '/projects' },
    { title: 'New Project', href: '/projects/new' },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Container size="md" my="xl">
      <Breadcrumbs mb="xl">{breadcrumbItems}</Breadcrumbs>
      <Title order={2} mb="lg">
        Create a New Project
      </Title>
      <Paper withBorder p={30} radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="lg">
            <TextInput
              label="Project Name"
              placeholder="e.g., Amal Residence, Casablanca"
              required
              {...register('name')}
              rightSection={<Building size={16} />}
              error={errors.name?.message}
            />

            <Textarea
              label="Project Description"
              placeholder="A brief summary of the project, its goals, and location."
              minRows={4}
              {...register('description')}
              error={errors.description?.message}
            />

            <Group grow>
              <Controller
                name="totalBudget"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    label="Total Budget (MAD)"
                    placeholder="e.g., 30000000"
                    required
                    thousandSeparator=","
                    min={0}
                    error={errors.totalBudget?.message}
                  />
                )}
              />
              <Controller
                name="expectedCompletion"
                control={control}
                render={({ field }) => (
                  <DateInput
                    {...field}
                    label="Expected Completion Date"
                    placeholder="Select a date"
                    clearable
                    error={errors.expectedCompletion?.message}
                    rightSection={<Calendar size={16} />}
                  />
                )}
              />
            </Group>

            <Group justify="flex-end" mt="md">
              <Button
                variant="default"
                component={Link}
                href="/dashboard"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                leftSection={<Save size={16} />}
                loading={isSubmitting}
              >
                Save Project
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
