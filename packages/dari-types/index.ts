// Export all Prisma types and enums
export * from './prisma/client';

// Custom composite types
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

// Import the types we're using in our custom types
import type {
  Project,
  Investment,
  Milestone,
  ProjectUpdate,
  Profile,
  Document,
} from './prisma/client';
