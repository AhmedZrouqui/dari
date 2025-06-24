import { Paper, Group, Text } from '@mantine/core';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group>
        <div className={`rounded-full p-3 bg-${color}-100 text-${color}-600`}>
          <Icon size={24} />
        </div>
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
