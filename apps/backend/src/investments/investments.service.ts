import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SanitizedUser } from '../common/types/user.types';
import { Investment, OrgRole } from '@dari/types';
import { EmailService } from '../email/email.service';
import { HashService } from '../auth/hash.service';
import * as crypto from 'crypto';

@Injectable()
export class InvestmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateInvestmentDto, developer: SanitizedUser) {
    const { projectId, investorEmail, amount, equityPercentage } = dto;

    // 1. Verify developer has permission to modify this project
    await this.verifyProjectAccess(projectId, developer.id);

    // 2. Check if an investment for this email already exists on this project
    const existingInvestment = await this.prisma.investment.findFirst({
      where: { projectId, user: { email: investorEmail } },
    });
    if (existingInvestment) {
      throw new ConflictException(
        'An investor with this email has already been added to this project.',
      );
    }

    // 3. Find or create the investor user
    let investor = await this.prisma.user.findUnique({
      where: { email: investorEmail },
    });

    if (!investor) {
      // If investor doesn't exist, create a new user account for them
      const temporaryPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await this.hashService.hash(temporaryPassword);

      investor = await this.prisma.user.create({
        data: {
          email: investorEmail,
          password: hashedPassword,
          isActive: false, // User must activate their account
        },
      });
      // In a real scenario, you would send an invitation/activation email
      // await this.emailService.sendInvitationEmail(investor, developer);
    }

    // 4. Create the investment record
    const newInvestment = await this.prisma.investment.create({
      data: {
        amount,
        equityPercentage,
        projectId,
        userId: investor.id,
      },
    });

    return newInvestment;
  }

  async findAllForProject(projectId: string, user: SanitizedUser) {
    await this.verifyProjectAccess(projectId, user.id);
    const investments = await this.prisma.investment.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: { name: true },
            },
          },
        },
      },
    });
    return investments.map((investment: Investment) => ({
      ...investment,
      amount: investment.amount.toNumber(),
    }));
  }

  private async verifyProjectAccess(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found.`);
    }
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        organizationId: project.organizationId,
        role: { in: [OrgRole.OWNER, OrgRole.ADMIN] },
      },
    });
    if (!membership) {
      throw new ForbiddenException(
        "You don't have permission to modify this project.",
      );
    }
  }
}
