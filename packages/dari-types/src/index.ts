// ===================================
// File: /packages/dari-types/src/index.ts
// Description: Explicitly export PrismaClient and all relevant types/enums.
// ===================================

import {
  PrismaClient as GeneratedPrismaClient,
  Prisma,
  User,
  Profile,
  Organization,
  Membership,
  Session,
  RefreshToken,
  PasswordResetToken,
  Project,
  Investment,
  Milestone,
  ProjectUpdate,
  Document,
  Role,
  OrgRole,
  ProjectStatus,
  MilestoneStatus,
  DocumentVisibility,
} from '../client';

export class PrismaClient extends GeneratedPrismaClient {}

export {
  Prisma,
  // Models
  User,
  Profile,
  Organization,
  Membership,
  Session,
  RefreshToken,
  PasswordResetToken,
  Project,
  Investment,
  Milestone,
  ProjectUpdate,
  Document,
  // Enums
  Role,
  OrgRole,
  ProjectStatus,
  MilestoneStatus,
  DocumentVisibility,
};

export enum AccountType {
  DEVELOPER = 'DEVELOPER',
  INVESTOR = 'INVESTOR',
}

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
