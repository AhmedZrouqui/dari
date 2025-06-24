import { ProjectClientPage } from '@/components/features/projects/ProjectClientPage';
import { getProjectData } from '@/lib/actions/projects';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const initialProject = await getProjectData(projectId);

  return (
    <ProjectClientPage projectId={projectId} initialProject={initialProject} />
  );
}
