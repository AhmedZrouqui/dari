'use client';

import { Menu, Group, Text, Avatar, UnstyledButton } from '@mantine/core';
import { Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth/auth.store';
import { clearAuthCookies } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function UserButton() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await clearAuthCookies(); // Clear httpOnly cookies via API route
    logout(); // Clear client-side store
    router.push('/auth/login'); // Redirect to login
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton className="p-2 rounded-md hover:bg-gray-100">
          <Group>
            <Avatar color="blue" radius="xl">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {user?.name}
              </Text>
              <Text c="dimmed" size="xs">
                {user?.email}
              </Text>
            </div>
            <ChevronDown size={14} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item leftSection={<Settings size={14} />}>Settings</Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<LogOut size={14} />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
