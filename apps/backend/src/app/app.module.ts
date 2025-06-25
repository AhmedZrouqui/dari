import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ProjectModule } from '../projects/projects.module';
import { PassportModule } from '@nestjs/passport';
import { MilestonesModule } from '../milestones/milestones.module';
import { ProjectUpdatesModule } from '../project-updates/project-updates.module';
import { InvestmentsModule } from '../investments/investments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
    PrismaModule,
    EmailModule,
    ProjectModule,
    MilestonesModule,
    ProjectUpdatesModule,
    InvestmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
