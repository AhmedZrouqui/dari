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
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Controller } from 'react-hook-form';
import Link from 'next/link';
import { useEditProjectForm } from '@/hooks/business/project/useEditProjectForm';
import { Project } from '@dari/types';
import { Calendar } from 'lucide-react';

interface EditProjectClientPageProps {
  project: Project;
}

export function EditProjectClientPage({ project }: EditProjectClientPageProps) {
  const { control, register, handleSubmit, errors, isSubmitting, onSubmit } =
    useEditProjectForm(project.id, project);

  const breadcrumbItems = [
    { title: 'Projects', href: '/projects' },
    { title: project.name, href: `/projects/${project.id}` },
    { title: 'Edit', href: `/projects/${project.id}/edit` },
  ].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Container size="md" my="xl">
      <Breadcrumbs mb="xl">{breadcrumbItems}</Breadcrumbs>
      <Title order={2} mb="lg">
        Edit Project: <span className="text-dari-blue-700">{project.name}</span>
      </Title>
      <Paper withBorder p={30} radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="lg">
            <TextInput
              label="Project Name"
              required
              {...register('name')}
              error={errors.name?.message}
            />
            <Textarea
              label="Project Description"
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
                    value={field.value ?? null}
                    label="Expected Completion Date"
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
                href={`/projects/${project.id}`}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
