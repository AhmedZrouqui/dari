'use client';

import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { InvestorAppShell } from '@/components/layout/InvestorAppShell';
import { Notifications } from '@mantine/notifications';

export default function InvestorAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <Notifications />
      <InvestorAppShell>{children}</InvestorAppShell>
    </ProtectedLayout>
  );
}
