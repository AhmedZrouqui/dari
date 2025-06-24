import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { SanitizedUser } from '../common/types/user.types';
import { OrgRole, Project } from '@dari/types';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, user: SanitizedUser) {
    console.log(user);
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId: user.id,
        role: { in: [OrgRole.OWNER, OrgRole.ADMIN] },
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        "You don't have permission to create a project in this organization.",
      );
    }

    const { organizationId } = membership;

    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        organizationId: organizationId,
      },
    });
  }

  async findAllForUser(user: SanitizedUser) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId: user.id },
    });

    if (!membership) {
      throw new ForbiddenException('You are not part of any organization.');
    }

    const projects = await this.prisma.project.findMany({
      where: {
        organizationId: membership.organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects.map((project) => ({
      ...project,
      totalBudget: project.totalBudget.toNumber(),
    }));
  }

  async findOneById(id: string, user: SanitizedUser) {
    const project = await this.verifyProjectAccess(id, user.id, [
      OrgRole.OWNER,
      OrgRole.ADMIN,
      OrgRole.MEMBER,
    ]);

    const projectDetails = await this.prisma.project.findUnique({
      where: { id },
      include: {
        milestones: true,
        investments: {
          include: {
            user: {
              select: { id: true, email: true },
            },
          },
        },
      },
    });

    return {
      ...projectDetails,
      totalBudget: projectDetails?.totalBudget.toNumber(),
    };
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: SanitizedUser,
  ) {
    // Verify the user is an Owner or Admin of the project's organization.
    await this.verifyProjectAccess(id, user.id, [OrgRole.OWNER, OrgRole.ADMIN]);

    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: string, user: SanitizedUser): Promise<void> {
    // Verify the user is the Owner of the project's organization.
    // Deleting is a destructive action, so we restrict it to owners only.
    await this.verifyProjectAccess(id, user.id, [OrgRole.OWNER]);

    await this.prisma.project.delete({
      where: { id },
    });
  }

  /**
   * A private helper method to verify if a user has access to a project
   * with a specific role. Throws an error if access is denied.
   * @param projectId The ID of the project to check
   * @param userId The ID of the user requesting access
   * @param allowedRoles An array of roles that are permitted access
   * @returns The project object if access is granted
   */
  private async verifyProjectAccess(
    projectId: string,
    userId: string,
    allowedRoles: OrgRole[],
  ): Promise<Project> {
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

    return project;
  }
}
