'use client';

import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { LayoutDashboard, Briefcase, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from './UserButton';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function DariAppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: false },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
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
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            href={link.href}
            label={link.label}
            leftSection={<link.icon size={16} />}
            component={Link}
            active={pathname === link.href}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
