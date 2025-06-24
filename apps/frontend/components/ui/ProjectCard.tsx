import { Project, ProjectStatus } from '@dari/types';
import { Paper, Title, Progress, Group, Badge, Text } from '@mantine/core';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusColors: Record<ProjectStatus, string> = {
    PLANNING: 'blue',
    IN_PROGRESS: 'cyan',
    ON_HOLD: 'orange',
    COMPLETED: 'teal',
    CANCELLED: 'gray',
  };

  return (
    <Paper
      component={Link}
      href={`projects/${project.id}`}
      withBorder
      p="md"
      radius="md"
      className="hover:shadow-lg transition-shadow duration-200"
    >
      <Group justify="space-between" mb="xs">
        <Title order={4} className="truncate">
          {project.name}
        </Title>
        <Badge color={statusColors[project.status]}>
          {project.status.replace('_', ' ')}
        </Badge>
      </Group>
      <Text size="sm" c="dimmed" mb="sm" lineClamp={2}>
        {project.description || 'No description provided.'}
      </Text>
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500}>
          Budget:
        </Text>
        <Text size="sm">
          {new Intl.NumberFormat('en-US').format(Number(project.totalBudget))}{' '}
          MAD
        </Text>
      </Group>
      <Progress.Root size="lg" radius="xl">
        {/* TODO: Replace with dynamic progress */}
        <Progress.Section value={35} color="blue" />
      </Progress.Root>
      <Text size="xs" c="dimmed" mt="xs">
        Last updated: {new Date(project.updatedAt).toLocaleDateString()}
      </Text>
    </Paper>
  );
}
