import { Paper, Group, Text, ThemeIcon } from '@mantine/core';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string; // e.g., 'blue', 'teal'
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <Paper
      withBorder
      p="lg"
      radius="md"
      className={`bg-gradient-to-br from-${color}-50 to-white`}
    >
      <Group>
        <ThemeIcon color={color} size={48} radius="md">
          <Icon size={24} />
        </ThemeIcon>
        <div>
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text fw={700} size="xl">
            {value}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}
