import { EditProjectClientPage } from '@/components/features/projects/EditProjectClientPage';
import { Project } from '@dari/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

async function getProjectData(projectId: string): Promise<Project | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
      {
        headers: { Cookie: `auth-token=${token}` },
        cache: 'no-store',
      }
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Server-side fetch for edit page failed:', error);
    return null;
  }
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const initialProject = await getProjectData(projectId);

  if (!initialProject) {
    notFound();
  }

  return <EditProjectClientPage project={initialProject} />;
}
