'use client';

import { useMilestonesForm } from '@/hooks/business/milestone/useMilestonesForm';
import { AddMilestoneValues } from '@/lib/schemas/milestone.schema';
import { Milestone, MilestoneStatus } from '@dari/types';
import {
  Paper,
  Title,
  Timeline,
  ActionIcon,
  TextInput,
  Button,
  Text,
  Loader,
  Group,
  Menu,
} from '@mantine/core';
import {
  Circle,
  LoaderCircle,
  Check,
  MoreHorizontal,
  Plus,
} from 'lucide-react';

interface MilestoneTimelineProps {
  projectId: string;
}

export function MilestoneTimeline({ projectId }: MilestoneTimelineProps) {
  const { milestones, isLoading, updateStatus, register, handleSubmit } =
    useMilestonesForm(projectId);

  const statusConfig: Record<
    MilestoneStatus,
    { color: string; icon: React.ReactNode }
  > = {
    PENDING: { color: 'gray', icon: <Circle size={12} /> },
    IN_PROGRESS: {
      color: 'blue',
      icon: <LoaderCircle size={12} className="animate-spin" />,
    },
    COMPLETED: { color: 'teal', icon: <Check size={12} /> },
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Paper withBorder p="md" radius="md" h="100%">
      <Title order={3} mb="md">
        Milestone Timeline
      </Title>

      {milestones && milestones.length > 0 ? (
        <Timeline
          active={milestones?.findIndex(
            (m: Milestone) => m.status === 'IN_PROGRESS'
          )}
          bulletSize={24}
          lineWidth={2}
        >
          {milestones?.map((milestone: Milestone) => {
            const config = statusConfig[milestone.status];
            return (
              <Timeline.Item
                key={milestone.id}
                bullet={config.icon}
                title={milestone.name}
                color={config.color}
              >
                <Group justify="space-between">
                  <Text c="dimmed" size="xs">
                    {milestone.description || 'No description.'}
                  </Text>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <MoreHorizontal size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Change Status</Menu.Label>
                      <Menu.Item
                        onClick={() =>
                          updateStatus({ id: milestone.id, status: 'PENDING' })
                        }
                      >
                        Pending
                      </Menu.Item>
                      <Menu.Item
                        onClick={() =>
                          updateStatus({
                            id: milestone.id,
                            status: 'IN_PROGRESS',
                          })
                        }
                      >
                        In Progress
                      </Menu.Item>
                      <Menu.Item
                        onClick={() =>
                          updateStatus({
                            id: milestone.id,
                            status: 'COMPLETED',
                          })
                        }
                      >
                        Completed
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
                <Text size="xs" mt={4}>
                  Target:{' '}
                  {milestone.targetDate
                    ? new Date(milestone.targetDate).toLocaleDateString()
                    : 'N/A'}
                </Text>
              </Timeline.Item>
            );
          })}
        </Timeline>
      ) : (
        <Text c="dimmed">
          No milestones have been added to this project yet.
        </Text>
      )}

      {/* Add new milestone form */}
      <form onSubmit={handleSubmit}>
        <Group mt="xl">
          <TextInput
            placeholder="Enter new milestone name"
            style={{ flex: 1 }}
            {...register('name')}
          />
          <Button type="submit" leftSection={<Plus size={16} />}>
            Add Milestone
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
