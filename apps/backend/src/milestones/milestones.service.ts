import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrgRole, Milestone } from '@dari/types';
import { SanitizedUser } from '../common/types/user.types';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(private prisma: PrismaService) {}

  async create(createMilestoneDto: CreateMilestoneDto, user: SanitizedUser) {
    const { projectId, ...milestoneData } = createMilestoneDto;

    // Verify user has permission to add a milestone to this project
    await this.verifyProjectAccess(projectId, user.id, [
      OrgRole.OWNER,
      OrgRole.ADMIN,
    ]);

    // Find the highest order number for the current project to append the new milestone
    const lastMilestone = await this.prisma.milestone.findFirst({
      where: { projectId },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastMilestone ? lastMilestone.order + 1 : 1;

    return this.prisma.milestone.create({
      data: {
        ...milestoneData,
        order: newOrder,
        project: {
          connect: { id: projectId },
        },
      },
    });
  }

  async findAllForProject(projectId: string, user: SanitizedUser) {
    await this.verifyProjectAccess(projectId, user.id, [
      OrgRole.OWNER,
      OrgRole.ADMIN,
      OrgRole.MEMBER,
    ]);

    return this.prisma.milestone.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });
  }

  async update(
    id: string,
    updateMilestoneDto: UpdateMilestoneDto,
    user: SanitizedUser,
  ) {
    const milestoneToUpdate = await this.findMilestoneAndVerifyAccess(
      id,
      user.id,
      [OrgRole.OWNER, OrgRole.ADMIN],
    );

    // Omit projectId from the update data if it exists, as it shouldn't be changed
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { projectId, ...updateData } = updateMilestoneDto;

    return this.prisma.milestone.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, user: SanitizedUser): Promise<void> {
    await this.findMilestoneAndVerifyAccess(id, user.id, [
      OrgRole.OWNER,
      OrgRole.ADMIN,
    ]);

    // Note: This does not re-order remaining milestones. That logic could be added later if needed.
    await this.prisma.milestone.delete({
      where: { id },
    });
  }

  private async findMilestoneAndVerifyAccess(
    milestoneId: string,
    userId: string,
    allowedRoles: OrgRole[],
  ): Promise<Milestone> {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
    });

    if (!milestone) {
      throw new NotFoundException(
        `Milestone with ID "${milestoneId}" not found.`,
      );
    }

    await this.verifyProjectAccess(milestone.projectId, userId, allowedRoles);
    return milestone;
  }

  private async verifyProjectAccess(
    projectId: string,
    userId: string,
    allowedRoles: OrgRole[],
  ): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found.`);
    }

    const membership = await this.prisma.membership.findFirst({
      where: {
        userId: userId,
        organizationId: project.organizationId,
      },
    });

    if (!membership || !allowedRoles.includes(membership.role)) {
      throw new ForbiddenException(
        "You don't have permission to perform this action on this project.",
      );
    }
  }
}
