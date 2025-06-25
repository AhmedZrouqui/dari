'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  Container,
  SimpleGrid,
  Title,
  Group,
  Button,
  Paper,
  Text,
  Alert,
  Center,
  Loader,
} from '@mantine/core';
import { Plus, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import ProjectCard from '@/components/ui/ProjectCard';
import { Project } from '@dari/types';

// API fetching function for the client
const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await api.get<Project[]>('/projects');

  return data;
};

interface ProjectsClientPageProps {
  initialProjects?: Project[] | null;
}

export function ProjectsClientPage({
  initialProjects,
}: ProjectsClientPageProps) {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    initialData: initialProjects || undefined,
  });

  if (isLoading) {
    // This is shown if the client is fetching for the first time (if server fetch failed)
    return (
      <Center h={400}>
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Container fluid my="md" px="lg">
        <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
          Failed to load projects. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid my="md" px="lg">
      <Group justify="space-between" mb="xl">
        <Title order={2}>My Projects</Title>
        <Button
          component={Link}
          href="/project/new"
          leftSection={<Plus size={16} />}
        >
          Add New Project
        </Button>
      </Group>

      {projects && projects.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </SimpleGrid>
      ) : (
        <Paper withBorder p="xl" radius="md" className="text-center mt-10">
          <Text size="lg" fw={500}>
            No Projects Found
          </Text>
          <Text c="dimmed" mt="xs" mb="md">
            Get started by creating your first project.
          </Text>
          <Button component={Link} href="/project/new">
            Create First Project
          </Button>
        </Paper>
      )}
    </Container>
  );
}
