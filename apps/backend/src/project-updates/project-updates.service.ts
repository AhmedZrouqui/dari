import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SanitizedUser } from 'src/common/types/user.types';
import { OrgRole } from '@dari/types';
import { CreateProjectUpdateDto } from './dto/create-update.dto';

@Injectable()
export class ProjectUpdatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjectUpdateDto, user: SanitizedUser) {
    const { projectId, title, content, attachmentIds = [] } = dto;

    // Verify user has permission to post an update to this project
    await this.verifyProjectAccess(projectId, user.id, [
      OrgRole.OWNER,
      OrgRole.ADMIN,
    ]);

    return this.prisma.projectUpdate.create({
      data: {
        title,
        content,
        projectId,
        authorId: user.id,
        // Connect the attachments to the update
        attachments: {
          connect: attachmentIds.map((id) => ({ id })),
        },
      },
    });
  }

  async findAllForProject(projectId: string, user: SanitizedUser) {
    // Any member of the project can view its updates
    await this.verifyProjectAccess(projectId, user.id, [
      OrgRole.OWNER,
      OrgRole.ADMIN,
      OrgRole.MEMBER,
    ]);

    return this.prisma.projectUpdate.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            profile: {
              select: { name: true },
            },
          },
        },
        attachments: true, // Include any photos or documents
      },
    });
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
      where: { userId, organizationId: project.organizationId },
    });

    if (!membership || !allowedRoles.includes(membership.role)) {
      throw new ForbiddenException(
        "You don't have permission for this action.",
      );
    }
  }
}
