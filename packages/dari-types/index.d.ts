export * from './prisma/client';
export type ProjectWithDetails = Project & {
    investments: Investment[];
    milestones: Milestone[];
};
export type ProjectUpdateWithAuthor = ProjectUpdate & {
    author: {
        profile: Profile | null;
    };
    attachments: Document[];
};
import type { Project, Investment, Milestone, ProjectUpdate, Profile, Document } from './prisma/client';
