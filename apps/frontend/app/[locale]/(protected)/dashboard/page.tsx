'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project } from '@dari/types';
import {
  Container,
  Grid,
  SimpleGrid,
  Skeleton,
  Text,
  Paper,
  Group,
  RingProgress,
  Button,
  Title,
} from '@mantine/core';
import { Landmark, Briefcase, Users, FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import ProjectCard from '@/components/ui/ProjectCard';

// API fetching function for TanStack Query
const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await api.get<Project[]>('/projects');

  return data;
};

export default function DashboardPage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  // Calculate stats once data is available
  const stats = {
    totalValue:
      projects?.reduce((acc, p) => acc + Number(p.totalBudget), 0) || 0,
    activeProjects:
      projects?.filter(
        (p) => p.status !== 'COMPLETED' && p.status !== 'CANCELLED'
      ).length || 0,
  };

  // Render loading state
  if (isLoading) {
    return (
      <Container my="md">
        <Skeleton height={50} mb="xl" />
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
          <Skeleton height={100} />
          <Skeleton height={100} />
          <Skeleton height={100} />
          <Skeleton height={100} />
        </SimpleGrid>
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Skeleton height={40} mb="md" />
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Skeleton height={150} />
              <Skeleton height={150} />
            </SimpleGrid>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Skeleton height={200} />
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  return (
    <Container fluid my="md" px="lg">
      {/* Action Header */}
      <Group justify="space-between" mb="xl">
        <Title order={2}>Dashboard</Title>
        <Button
          component={Link}
          href="projects/new"
          leftSection={<Plus size={16} />}
        >
          Add New Project
        </Button>
      </Group>

      {/* KPI Metrics */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
        <StatCard
          title="Total Portfolio Value"
          value={`${(stats.totalValue / 1_000_000).toFixed(1)}M MAD`}
          icon={Landmark}
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects.toString()}
          icon={Briefcase}
          color="teal"
        />
        <StatCard
          title="Total Investors"
          value="23"
          icon={Users}
          color="violet"
        />
        <StatCard title="Documents" value="147" icon={FileText} color="grape" />
      </SimpleGrid>

      {/* Projects Overview */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Title order={3} mb="md">
            My Projects
          </Title>
          {projects && projects.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="xl" radius="md" className="text-center">
              <Text>You haven't created any projects yet.</Text>
              <Button component={Link} href="projects/new" mt="md">
                Create Your First Project
              </Button>
            </Paper>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Title order={3} mb="md">
              Project Status
            </Title>
            <Group justify="center">
              <RingProgress
                size={180}
                thickness={16}
                label={
                  <Text size="xs" ta="center">
                    Total Projects
                  </Text>
                }
                sections={[
                  { value: 40, color: 'cyan' },
                  { value: 15, color: 'orange' },
                  { value: 15, color: 'grape' },
                ]}
              />
            </Group>
            {/* TODO: Add Legend */}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
