'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project } from '@dari/types';
import {
  Container,
  SimpleGrid,
  Skeleton,
  Paper,
  Group,
  Title,
  Alert,
} from '@mantine/core';
import { Building } from 'lucide-react';
import ProjectCard from '@/components/ui/ProjectCard'; // Reusing the same project card!

// API fetching function - it calls the same endpoint as the developer!
const fetchInvestorProjects = async (): Promise<Project[]> => {
  const { data } = await api.get<Project[]>('/projects');
  return data;
};

export default function InvestorDashboardPage() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['investorProjects'], // Use a different queryKey to avoid conflicts
    queryFn: fetchInvestorProjects,
  });

  if (isLoading) {
    return (
      <Container my="md">
        <Skeleton height={40} width={300} mb="xl" />
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="lg">
          <Skeleton height={200} />
          <Skeleton height={200} />
        </SimpleGrid>
      </Container>
    );
  }

  return (
    <Container fluid my="md" px="lg">
      <Group justify="space-between" mb="xl">
        <Title order={2}>My Investments</Title>
      </Group>

      {projects && projects.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="lg">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </SimpleGrid>
      ) : (
        <Paper withBorder p="xl" radius="md">
          <Alert icon={<Building size={20} />} title="No Investments Found">
            You have not been added to any projects yet. When a developer adds
            you to a project, it will appear here.
          </Alert>
        </Paper>
      )}
    </Container>
  );
}
