import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { DariAppShell } from '@/components/layout/AppShell';
import { Notifications } from '@mantine/notifications';

export default function ProtectedAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <DariAppShell>{children}</DariAppShell>
    </ProtectedLayout>
  );
}
