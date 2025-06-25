'use client';

import {
  Paper,
  Title,
  Button,
  Group,
  Text,
  Stack,
  Avatar,
  Table,
  Center,
  Loader,
  Alert,
  Box,
} from '@mantine/core';
import { UserPlus } from 'lucide-react';
import { useInvestments } from '@/hooks/business/investment/useInvestments';
import { InviteInvestorModal } from './InviteInvestorModal';

export function InvestorManager({ projectId }: { projectId: string }) {
  const {
    investments,
    isLoading,
    form,
    isCreating,
    onSubmit,
    isModalOpen,
    openModal,
    closeModal,
  } = useInvestments(projectId);

  // Desktop Table View
  const desktopRows = investments?.map((investment) => (
    <Table.Tr key={investment.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={26} src={null} alt="Investor Avatar" radius={26} />
          <Text size="sm" fw={500}>
            {investment.user.profile?.name || 'Pending Activation'}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>{investment.user.email}</Table.Td>
      <Table.Td>
        {new Intl.NumberFormat().format(investment.amount)} MAD
      </Table.Td>
      <Table.Td>{investment.equityPercentage}%</Table.Td>
    </Table.Tr>
  ));

  // Mobile Card View
  const mobileCards = investments?.map((investment) => (
    <Paper withBorder p="md" radius="md" key={investment.id} mb="sm">
      <Group justify="space-between">
        <Group gap="sm">
          <Avatar size={38} src={null} alt="Investor Avatar" radius="xl" />
          <div>
            <Text fw={500}>
              {investment.user.profile?.name || 'Pending Activation'}
            </Text>
            <Text c="dimmed" size="xs">
              {investment.user.email}
            </Text>
          </div>
        </Group>
      </Group>
      <Group justify="space-between" mt="md">
        <Stack gap={0}>
          <Text size="xs" c="dimmed">
            Amount
          </Text>
          <Text fw={500}>
            {new Intl.NumberFormat().format(investment.amount)} MAD
          </Text>
        </Stack>
        <Stack gap={0} align="flex-end">
          <Text size="xs" c="dimmed">
            Equity
          </Text>
          <Text fw={500}>{investment.equityPercentage}%</Text>
        </Stack>
      </Group>
    </Paper>
  ));

  return (
    <>
      <InviteInvestorModal
        opened={isModalOpen}
        onClose={closeModal}
        form={form}
        onSubmit={onSubmit}
        isCreating={isCreating}
      />
      <Paper withBorder p="xl" radius="md" h="100%">
        <Group justify="space-between" mb="xl">
          <Title order={3}>Investors</Title>
          <Button
            onClick={openModal}
            leftSection={<UserPlus size={16} />}
            variant="light"
          >
            Invite Investor
          </Button>
        </Group>

        {isLoading && (
          <Center h={100}>
            <Loader />
          </Center>
        )}

        {investments && investments.length > 0 ? (
          <>
            {/* THE FIX: Show table on screens 'sm' and larger */}
            <Box visibleFrom="sm">
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Equity</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{desktopRows}</Table.Tbody>
              </Table>
            </Box>
            {/* THE FIX: Show cards on screens smaller than 'sm' */}
            <Box hiddenFrom="sm">
              <Stack>{mobileCards}</Stack>
            </Box>
          </>
        ) : (
          !isLoading && (
            <Alert icon={<UserPlus size={16} />} title="No Investors Yet">
              Invite your first investor to this project.
            </Alert>
          )
        )}
      </Paper>
    </>
  );
}
