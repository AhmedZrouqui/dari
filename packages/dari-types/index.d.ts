import { Project, Milestone, Investment } from './prisma';

export type ProjectWithDetails = Project & {
  investments: Investment[];
  milestones: Milestone[];
};

export * from './prisma';
