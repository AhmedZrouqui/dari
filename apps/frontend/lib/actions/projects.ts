// lib/actions/projects.ts
import { Project, ProjectWithDetails } from '@dari/types';
import { cookies } from 'next/headers';

export async function getProjectsData(): Promise<Project[] | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects`,
      {
        headers: { Cookie: `auth-token=${token}` },
        cache: 'no-store',
      }
    );

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error('Server-side projects fetch failed:', error);
    return null;
  }
}

export async function getProjectData(
  projectId: string
): Promise<ProjectWithDetails | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      console.log('No auth token found on server');
      return null;
    }

    // Build cookie string for the request
    const cookieString = `auth-token=${token}`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
      {
        headers: {
          Cookie: cookieString, // Send cookie instead of Bearer token
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Ensure fresh data
      }
    );

    if (!response.ok) {
      console.log(`Server fetch failed: ${response.status}`);
      return null; // Let client handle the retry
    }

    return await response.json();
  } catch (error) {
    console.error('Server-side fetch error:', error);
    return null; // Graceful fallback to client-side
  }
}
