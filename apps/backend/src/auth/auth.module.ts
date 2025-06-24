import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { HashService } from './hash.service';
import { EmailModule } from 'src/email/email.module';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule.register({}), EmailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy, HashService],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
