'use client';

import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Title,
  Stack,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from './UserButton';

const navLinks = [
  { href: '/dashboard', label: 'My Investments', icon: LayoutDashboard },
];

export function InvestorAppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: false },
      }}
      padding="lg"
      layout="alt"
    >
      <AppShell.Header withBorder={false} className="bg-transparent">
        <Group h="100%" px="lg" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={3} className="text-dari-blue-700">
              Dari
            </Title>
          </Group>
          <UserButton />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack justify="space-between" h="100%">
          <Box>
            <Title order={4} p="xs" mb="xl" c="dimmed">
              Investor Portal
            </Title>

            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                leftSection={<link.icon size={20} strokeWidth={1.5} />}
                component={Link}
                active={pathname.endsWith(link.href)} // Handles locale prefixes
                variant="filled"
                className="rounded-md"
              />
            ))}
          </Box>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main className="bg-gray-50/50">{children}</AppShell.Main>
    </AppShell>
  );
}
