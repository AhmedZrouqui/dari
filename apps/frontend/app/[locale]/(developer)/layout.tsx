import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { DeveloperAppShell } from '@/components/layout/DeveloperAppShell';

export default function ProtectedAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <DeveloperAppShell>{children}</DeveloperAppShell>
    </ProtectedLayout>
  );
}
