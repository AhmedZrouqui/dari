// packages/dari-types/src/index.ts

// Import from the generated Prisma client
import {
  Prisma,
  type User,
  type Profile,
  type Organization,
  type Membership,
  type Session,
  type RefreshToken,
  type PasswordResetToken,
  type Project,
  type Investment,
  type Milestone,
  type ProjectUpdate,
  type Document,
  // Enums
  Role,
  OrgRole,
  ProjectStatus,
  MilestoneStatus,
  DocumentVisibility,
} from '@dari/prisma'; // updated to match new alias

// Custom enum
export enum AccountType {
  DEVELOPER = 'DEVELOPER',
  INVESTOR = 'INVESTOR',
}

// Composite types
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

// Re-export all core types & enums
export {
  Prisma,
  // Models
  type User,
  type Profile,
  type Organization,
  type Membership,
  type Session,
  type RefreshToken,
  type PasswordResetToken,
  type Project,
  type Investment,
  type Milestone,
  type ProjectUpdate,
  type Document,
  // Enums
  Role,
  OrgRole,
  ProjectStatus,
  MilestoneStatus,
  DocumentVisibility,
};
