'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project, ProjectStatus } from '@dari/types';
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
  Center,
  Stack,
} from '@mantine/core';
import { Landmark, Briefcase, Users, FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import ProjectCard from '@/components/ui/ProjectCard';
import { useMemo } from 'react';

// API fetching function
const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await api.get<Project[]>('/projects');
  return data;
};

export default function DashboardPage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  // Calculate stats and chart data using useMemo for performance
  const { stats, chartData } = useMemo(() => {
    if (!projects) {
      return {
        stats: { totalValue: 0, activeProjects: 0 },
        chartData: { sections: [], legend: [], total: 0 },
      };
    }

    const statusCounts = projects.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      {} as Record<ProjectStatus, number>
    );

    const totalProjects = projects.length;

    const statusConfig = {
      IN_PROGRESS: { color: 'cyan', label: 'In Progress' },
      PLANNING: { color: 'blue', label: 'Planning' },
      ON_HOLD: { color: 'orange', label: 'On Hold' },
      COMPLETED: { color: 'teal', label: 'Completed' },
      CANCELLED: { color: 'gray', label: 'Cancelled' },
    };

    const sections = Object.entries(statusCounts).map(([status, count]) => ({
      value: (count / totalProjects) * 100,
      color: statusConfig[status as ProjectStatus].color,
      tooltip: `${count} projects - ${statusConfig[status as ProjectStatus].label}`,
    }));

    const legend = Object.entries(statusCounts).map(([status, count]) => ({
      count,
      label: statusConfig[status as ProjectStatus].label,
      color: statusConfig[status as ProjectStatus].color,
    }));

    const calculatedStats = {
      totalValue: projects.reduce((acc, p) => acc + Number(p.totalBudget), 0),
      activeProjects: projects.filter(
        (p) => p.status !== 'COMPLETED' && p.status !== 'CANCELLED'
      ).length,
    };

    return {
      stats: calculatedStats,
      chartData: { sections, legend, total: totalProjects },
    };
  }, [projects]);

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
      </Container>
    );
  }

  return (
    <Container fluid my="md" px="lg">
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

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Title order={3} mb="md">
            My Projects
          </Title>
          {projects && projects.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, xl: 2 }} spacing="lg">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="xl" radius="md" className="text-center ">
              <Text>You haven't created any projects yet.</Text>
              <Button component={Link} href="projects/new" mt="md">
                Create Your First Project
              </Button>
            </Paper>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="xl" radius="md">
            <Title order={3} mb="md">
              Project Status
            </Title>
            <Group justify="center" my="lg">
              <RingProgress
                size={200}
                thickness={20}
                label={
                  <Center>
                    <Text fw={700} size="xl">
                      {chartData.total}
                    </Text>
                  </Center>
                }
                sections={chartData.sections}
              />
            </Group>
            <Stack gap="xs">
              {chartData.legend.map((item) => (
                <Group key={item.label} justify="space-between">
                  <Group gap="sm">
                    <div
                      className={`w-3 h-3 rounded-full bg-${item.color}-500`}
                    ></div>
                    <Text size="sm">{item.label}</Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    {item.count}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
