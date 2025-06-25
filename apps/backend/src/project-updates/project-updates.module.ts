import { Module } from '@nestjs/common';
import { ProjectUpdatesService } from './project-updates.service';
import { ProjectUpdatesController } from './project-updates.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PrismaModule, AuthModule, PassportModule],
  controllers: [ProjectUpdatesController],
  providers: [ProjectUpdatesService],
})
export class ProjectUpdatesModule {}
