import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AccountType } from '@dari/types';
import { LoginDto } from './dto/login.dto';
import { HashService } from './hash.service';
import { User, Role } from '@dari/types';
import { SanitizedUser } from '../common/types/user.types';
import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private hashService: HashService,
    private emailService: EmailService,
  ) {}

  private async getTokens(userId: string, email: string, role: Role) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email, role },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, email, role },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Store the new refresh token
    await this.prisma.refreshToken.create({
      data: {
        userId: userId,
        tokenHash: hashedRefreshToken,
        expiresAt: expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const hashedPassword = await this.hashService.hash(dto.password);

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException(
        'An account with this email already exists.',
      );
    }

    if (dto.accountType === AccountType.DEVELOPER) {
      // Developer Registration Flow
      // The validation pipe now handles this check, so we can remove the manual check.

      const newUser = await this.prisma.$transaction(async (tx: any) => {
        const user = await tx.user.create({
          data: { email: dto.email, password: hashedPassword },
        });
        await tx.profile.create({
          data: { name: dto.name, userId: user.id },
        });
        const org = await tx.organization.create({
          data: { name: dto.organizationName!, ownerId: user.id },
        });
        await tx.membership.create({
          data: { userId: user.id, organizationId: org.id, role: 'OWNER' },
        });
        return user;
      });

      const tokens = await this.getTokens(
        newUser.id,
        newUser.email,
        newUser.role,
      );
      const sanitizedUser = this.sanitizeUser(newUser);
      return { ...tokens, user: sanitizedUser };
    } else {
      // Investor Registration Flow
      const newUser = await this.prisma.$transaction(async (tx: any) => {
        const user = await tx.user.create({
          data: { email: dto.email, password: hashedPassword },
        });
        await tx.profile.create({
          data: { name: dto.name, userId: user.id },
        });
        // No organization or membership is created for an investor.
        return user;
      });

      const tokens = await this.getTokens(
        newUser.id,
        newUser.email,
        newUser.role,
      );
      const sanitizedUser = this.sanitizeUser(newUser);
      return { ...tokens, user: sanitizedUser };
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (
      !user ||
      !(await this.hashService.compare(dto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) throw new UnauthorizedException('User is not active');

    await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    const tokens = await this.getTokens(user.id, user.email, user.role);
    const sanitizedUser = this.sanitizeUser(user);

    return { ...tokens, user: sanitizedUser };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException('Access Denied');

    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    const tokenFromDb = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashedRefreshToken },
    });

    if (!tokenFromDb || new Date() > tokenFromDb.expiresAt) {
      throw new ForbiddenException(
        'Access Denied: Invalid or expired refresh token.',
      );
    }

    // Invalidate the used refresh token
    await this.prisma.refreshToken.delete({ where: { id: tokenFromDb.id } });

    // Issue a new pair of tokens
    return this.getTokens(user.id, user.email, user.role);
  }

  generateToken(user: SanitizedUser) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: { select: { name: true } } },
    });

    if (user) {
      const { token, tokenHash } = this.generatePasswordResetToken();
      const expiresAt = new Date(Date.now() + 3600000); // valid for 1 hour

      await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: tokenHash,
          expiresAt: expiresAt,
        },
      });
      console.log(`Password reset token for ${email}: ${token}`);
      await this.emailService.sendPasswordResetEmail(user, token);
    }

    return {
      message:
        'If your email is registered, you will receive a password reset link.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = dto;

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    if (new Date() > resetToken.expiresAt) {
      await this.prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const newHashedPassword = await this.hashService.hash(password);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: newHashedPassword },
      }),
      this.prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    return { message: 'Password has been reset successfully.' };
  }

  private generatePasswordResetToken(): { token: string; tokenHash: string } {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return { token, tokenHash };
  }
}
