import { ProjectsClientPage } from '@/components/features/projects/ProjectsClientPage';
import { getProjectsData } from '@/lib/actions/projects';

export default async function ProjectsPage() {
  const initialProjects = await getProjectsData();

  return <ProjectsClientPage initialProjects={initialProjects} />;
}
