import { ProjectUpdateWithAuthor } from '@dari/types';
import { Avatar, Group, Paper, Text, Title } from '@mantine/core';

export default function UpdateCard({
  update,
}: {
  update: ProjectUpdateWithAuthor;
}) {
  const authorName = update.author?.profile?.name || 'Unknown User';
  return (
    <Paper withBorder p="md" radius="md" mb="md">
      <Group>
        <Avatar color="blue" radius="xl">
          {authorName.charAt(0)}
        </Avatar>
        <div>
          <Text fw={500}>{authorName}</Text>
          <Text size="xs" c="dimmed">
            {new Date(update.createdAt).toLocaleString()}
          </Text>
        </div>
      </Group>
      <Title order={5} mt="md">
        {update.title}
      </Title>
      <Text mt="xs" size="sm">
        {update.content}
      </Text>
      {/* TODO: Display attachments */}
    </Paper>
  );
}
