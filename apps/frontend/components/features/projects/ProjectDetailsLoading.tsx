'use client';

import { Container, Skeleton, Grid, SimpleGrid } from '@mantine/core';

export default function ProjectDetailsLoading() {
  return (
    <Container fluid my="md" px="lg">
      <Skeleton height={20} width={250} mb="xl" />
      <Skeleton height={40} width={400} mb="lg" />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Skeleton height={80} />
      </SimpleGrid>
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Skeleton height={300} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Skeleton height={200} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
