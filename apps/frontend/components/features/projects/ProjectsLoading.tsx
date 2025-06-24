'use client';

import { Container, Skeleton, Grid, SimpleGrid, Group } from '@mantine/core';

export default function ProjectsLoading() {
  return (
    <Container fluid my="md" px="lg">
      <Group justify="space-between" mb="xl">
        <Skeleton height={40} width={250} />
        <Skeleton height={36} width={150} />
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        <Skeleton height={180} />
        <Skeleton height={180} />
        <Skeleton height={180} />
        <Skeleton height={180} />
        <Skeleton height={180} />
        <Skeleton height={180} />
      </SimpleGrid>
    </Container>
  );
}
