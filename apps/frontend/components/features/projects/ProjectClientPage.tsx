'use client';

import { ProjectWithDetails } from '@dari/types';
import {
  Title,
  Button,
  SimpleGrid,
  Text,
  Container,
  Group,
  Grid,
  Loader,
  Center,
  Alert,
  Stack,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Edit,
  Landmark,
  Users,
  Briefcase,
  FileText,
  AlertCircle,
} from 'lucide-react';

import StatCard from '@/components/ui/StatCard';
import api from '@/lib/api';
import { MilestoneTimeline } from '../milestones/MilestoneTimeline';
import { UpdatesFeed } from './UpdatesFeed';
import { InvestorManager } from './InvestorManager';

interface ProjectClientPageProps {
  projectId: string;
  initialProject?: ProjectWithDetails | null; // Can be null if server fetch failed
}

const fetchProjectById = async (
  projectId: string
): Promise<ProjectWithDetails> => {
  const { data } = await api.get<ProjectWithDetails>(`/projects/${projectId}`);
  return data;
};

export function ProjectClientPage({
  projectId,
  initialProject,
}: ProjectClientPageProps) {
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProjectById(projectId),
    initialData: initialProject || undefined, // Only use if not null
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <Container fluid my="md" px="lg">
        <Center h={400}>
          <div style={{ textAlign: 'center' }}>
            <Loader size="lg" mb="md" />
            <Text>Loading project...</Text>
          </div>
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid my="md" px="lg">
        <Alert
          icon={<AlertCircle size={16} />}
          title="Error loading project"
          color="red"
          variant="light"
        >
          {error instanceof Error
            ? error.message
            : 'Failed to load project. Please try again later.'}
        </Alert>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container fluid my="md" px="lg">
        <Alert
          icon={<AlertCircle size={16} />}
          title="Project not found"
          color="yellow"
          variant="light"
        >
          The requested project could not be found or you don&apos;t have
          permission to view it.
        </Alert>
      </Container>
    );
  }

  const stats = {
    totalBudget: new Intl.NumberFormat().format(Number(project.totalBudget)),
    investorCount: project.investments?.length || 0,
    milestoneCount: project.milestones?.length || 0,
  };

  console.log(stats.totalBudget);

  return (
    <Container fluid my="md" px="lg">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <Title order={2}>{project.name}</Title>
        <Button
          component={Link}
          href={`/projects/${project.id}/edit`}
          leftSection={<Edit size={16} />}
        >
          Edit Project
        </Button>
      </Group>

      {/* KPI Metrics */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
        <StatCard
          title="Total Budget"
          value={`${stats.totalBudget} MAD`}
          icon={Landmark}
          color="blue"
        />
        <StatCard
          title="Investors"
          value={stats.investorCount.toString()}
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Total Milestones"
          value={stats.milestoneCount.toString()}
          icon={Briefcase}
          color="violet"
        />
        <StatCard
          title="Status"
          value={project.status.replace('_', ' ')}
          icon={FileText}
          color="grape"
        />
      </SimpleGrid>

      {/* Main Content Area */}
      <Grid>
        {/* THE FIX: UpdatesFeed and InvestorManager now stack on mobile */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack>
            <MilestoneTimeline projectId={project.id} />
            <UpdatesFeed projectId={project.id} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <InvestorManager projectId={project.id} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
