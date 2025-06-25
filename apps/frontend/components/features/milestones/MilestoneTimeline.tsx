'use client';

import {
  Timeline,
  Text,
  Group,
  Menu,
  ActionIcon,
  Loader,
  Paper,
  Button,
  Title,
  Center,
  Badge,
} from '@mantine/core';
import {
  Check,
  LoaderCircle,
  MoreHorizontal,
  Circle,
  Plus,
  Pencil,
} from 'lucide-react';
import { MilestoneStatus } from '@dari/types';
import { useMilestones } from '@/hooks/business/milestone/useMilestones';
import { MilestoneModal } from './MilestoneModal';

interface MilestoneTimelineProps {
  projectId: string;
}

export function MilestoneTimeline({ projectId }: MilestoneTimelineProps) {
  const {
    milestones,
    isLoading,
    updateStatus,
    form,
    isModalOpen,
    editingId,
    isSaving,
    handleOpenAddModal,
    handleOpenEditModal,
    closeModal,
    onSubmit,
  } = useMilestones(projectId);

  const statusConfig: Record<
    MilestoneStatus,
    { color: string; icon: React.ReactNode; label: string }
  > = {
    PENDING: { color: 'orange', icon: <Circle size={12} />, label: 'Pending' },
    IN_PROGRESS: {
      color: 'blue',
      icon: <LoaderCircle size={12} className="animate-spin" />,
      label: 'In Progress',
    },
    COMPLETED: { color: 'teal', icon: <Check size={12} />, label: 'Completed' },
  };

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <MilestoneModal
        opened={isModalOpen}
        onClose={closeModal}
        form={form}
        onSubmit={onSubmit}
        isSaving={isSaving}
        editingId={editingId}
      />
      <Paper withBorder p="xl" radius="md" h="100%">
        <Group justify="space-between" mb="xl">
          <Title order={3}>Milestone Timeline</Title>
          <Button
            onClick={handleOpenAddModal}
            leftSection={<Plus size={16} />}
            variant="light"
          >
            Add Milestone
          </Button>
        </Group>

        {milestones && milestones.length > 0 ? (
          <Timeline
            active={milestones.findIndex((m) => m.status === 'IN_PROGRESS')}
            bulletSize={24}
            lineWidth={3}
          >
            {milestones.map((milestone) => {
              const config = statusConfig[milestone.status];
              return (
                <Timeline.Item
                  key={milestone.id}
                  bullet={config.icon}
                  title={
                    <Paper
                      withBorder
                      p="md"
                      radius="md"
                      shadow="xs"
                      className="mb-4"
                    >
                      <Group justify="space-between">
                        <Title order={5}>{milestone.name}</Title>
                        <Group gap="xs">
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => handleOpenEditModal(milestone)}
                          >
                            <Pencil size={16} />
                          </ActionIcon>
                          <Menu shadow="md" width={200} withinPortal>
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray">
                                <MoreHorizontal size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Label>Change Status</Menu.Label>
                              <Menu.Item
                                onClick={() =>
                                  updateStatus({
                                    id: milestone.id,
                                    status: 'PENDING',
                                  })
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
                      </Group>
                      <Text c="dimmed" size="sm" mt={4}>
                        {milestone.description || 'No description.'}
                      </Text>
                      <Group justify="space-between" mt="md">
                        <Badge color={config.color} variant="light">
                          {config.label}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          Target:{' '}
                          {milestone.targetDate
                            ? new Date(
                                milestone.targetDate
                              ).toLocaleDateString()
                            : 'N/A'}
                        </Text>
                      </Group>
                    </Paper>
                  }
                  color={config.color}
                  lineVariant="dashed"
                />
              );
            })}
          </Timeline>
        ) : (
          <Center h={100}>
            <Text c="dimmed">
              No milestones have been added. Click &quot;Add Milestone&quot; to
              get started.
            </Text>
          </Center>
        )}
      </Paper>
    </>
  );
}
