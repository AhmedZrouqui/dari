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
import { LayoutDashboard, Briefcase, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from './UserButton';

// Navigation links data
const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: Briefcase },
];

const settingsLinks = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function DariAppShell({ children }: { children: React.ReactNode }) {
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
      layout="alt" // This gives a modern layout where header is part of the content area
    >
      {/* HEADER: Cleaner, with more padding */}
      <AppShell.Header withBorder={false} className="bg-transparent">
        <Group h="100%" px="lg" justify="space-between">
          {/* Burger for mobile, but also visible on desktop to allow collapsing the sidebar */}
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          {/* This empty group helps with alignment on desktop */}
          <Group visibleFrom="sm"></Group>

          <UserButton />
        </Group>
      </AppShell.Header>

      {/* NAVBAR: Redesigned for better spacing and visual hierarchy */}
      <AppShell.Navbar p="md">
        <Stack justify="space-between" h="100%">
          <Box>
            <Group p="xs" mb="xl">
              {/* Your Logo Here */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 22L12 14L20 22"
                  stroke="#1c7ed6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 14L12 6L20 14"
                  stroke="#228be6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 6L12 2L20 6"
                  stroke="#4dabf7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Title order={2} className="text-dari-blue-700">
                Dari
              </Title>
            </Group>

            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                leftSection={<link.icon size={20} strokeWidth={1.5} />}
                component={Link}
                active={
                  pathname === link.href ||
                  (link.href !== '/dashboard' && pathname.startsWith(link.href))
                }
                variant="filled"
                className="rounded-md"
              />
            ))}
          </Box>

          <Box>
            {settingsLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                leftSection={<link.icon size={20} strokeWidth={1.5} />}
                component={Link}
                active={pathname.startsWith(link.href)}
                variant="filled"
                className="rounded-md"
              />
            ))}
          </Box>
        </Stack>
      </AppShell.Navbar>

      {/* MAIN CONTENT AREA: Now has a light gray background for contrast */}
      <AppShell.Main className="bg-gray-50/50">{children}</AppShell.Main>
    </AppShell>
  );
}
