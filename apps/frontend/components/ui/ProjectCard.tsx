import { Project, ProjectStatus } from '@dari/types';
import {
  Paper,
  Title,
  Progress,
  Group,
  Badge,
  Text,
  Stack,
  Box,
  Tooltip,
} from '@mantine/core';
import { Users, Briefcase, Landmark } from 'lucide-react';
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

  const progressValue = 35; // TODO: Replace with dynamic progress calculation

  return (
    <Paper
      component={Link}
      href={`/projects/${project.id}`}
      withBorder
      p="lg"
      radius="md"
      className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col bg-white no-underline"
    >
      {/* Header Section - THE FIX */}
      <Group justify="space-between" mb="xs" align="flex-start" wrap="nowrap">
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Title order={3} fw={600} c="dark.8" lineClamp={1}>
            {project.name}
          </Title>
        </Box>
        <Badge
          color={statusColors[project.status]}
          variant="light"
          size="md"
          style={{ flexShrink: 0 }}
        >
          {project.status.replace('_', ' ')}
        </Badge>
      </Group>

      {/* Description Section */}
      <Text size="sm" c="dimmed" lineClamp={2} style={{ flexGrow: 1 }}>
        {project.description || 'No description provided.'}
      </Text>

      {/* Progress Bar Section */}
      <Stack gap={5} my="md">
        <Group justify="space-between">
          <Text size="xs" c="dimmed" fw={500}>
            Progress
          </Text>
          <Text size="sm" fw={500} c="dark.8">
            {progressValue}%
          </Text>
        </Group>
        <Progress.Root size="sm" radius="xl">
          <Progress.Section
            value={progressValue}
            color={statusColors[project.status]}
          />
        </Progress.Root>
      </Stack>

      {/* Footer Section - Redesigned for cleaner alignment */}
      <Group
        justify="space-between"
        mt="auto"
        pt="md"
        className="border-t border-gray-100"
      >
        <Group gap="md">
          <Tooltip label="Investors">
            <Group gap={4} align="center">
              <Users size={16} className="text-gray-500" />
              <Text size="sm" fw={500} c="dimmed">
                23
              </Text>
            </Group>
          </Tooltip>
          <Tooltip label="Milestones">
            <Group gap={4} align="center">
              <Briefcase size={16} className="text-gray-500" />
              <Text size="sm" fw={500} c="dimmed">
                12
              </Text>
            </Group>
          </Tooltip>
        </Group>
        <Group gap={4} align="center">
          <Landmark size={16} className="text-gray-500" />
          <Text size="sm" fw={600} c="dark.6">
            {new Intl.NumberFormat('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
            }).format(Number(project.totalBudget))}{' '}
            MAD
          </Text>
        </Group>
      </Group>
    </Paper>
  );
}
