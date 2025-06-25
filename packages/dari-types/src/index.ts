// ===================================
// File: /packages/dari-types/src/index.ts (FINAL, DEFINITIVE FIX)
// Description: This version separates type and value exports to satisfy
// the 'isolatedModules' constraint in Next.js.
// ===================================

// Import all the types and enums we need from the generated client.
import {
  Prisma,
  type User as PrismaUser,
  type Profile as PrismaProfile,
  type Organization as PrismaOrganization,
  type Membership as PrismaMembership,
  type Session as PrismaSession,
  type RefreshToken as PrismaRefreshToken,
  type PasswordResetToken as PrismaPasswordResetToken,
  type Project as PrismaProject,
  type Investment as PrismaInvestment,
  type Milestone as PrismaMilestone,
  type ProjectUpdate as PrismaProjectUpdate,
  type Document as PrismaDocument,
  // Import enums as values
  Role,
  OrgRole,
  ProjectStatus,
  MilestoneStatus,
  DocumentVisibility,
} from '../prisma/client';

// Define our custom, composite types using the base types.
export type ProjectWithDetails = PrismaProject & {
  investments: PrismaInvestment[];
  milestones: PrismaMilestone[];
};

export type ProjectUpdateWithAuthor = PrismaProjectUpdate & {
  author: {
    profile: PrismaProfile | null;
  };
  attachments: PrismaDocument[];
};

// Also define an AccountType enum here, as it's a shared concept
export enum AccountType {
  DEVELOPER = 'DEVELOPER',
  INVESTOR = 'INVESTOR',
}

// THE FIX: Explicitly export all types using `export type`.
export type {
  PrismaUser as User,
  PrismaProfile as Profile,
  PrismaOrganization as Organization,
  PrismaMembership as Membership,
  PrismaSession as Session,
  PrismaRefreshToken as RefreshToken,
  PrismaPasswordResetToken as PasswordResetToken,
  PrismaProject as Project,
  PrismaInvestment as Investment,
  PrismaMilestone as Milestone,
  PrismaProjectUpdate as ProjectUpdate,
  PrismaDocument as Document,
};

// THE FIX: Explicitly export all enums (which are values at runtime) in a separate export.
export { Role, OrgRole, ProjectStatus, MilestoneStatus, DocumentVisibility };
