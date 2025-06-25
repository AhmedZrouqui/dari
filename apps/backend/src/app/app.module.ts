import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { ProjectModule } from 'src/projects/projects.module';
import { PassportModule } from '@nestjs/passport';
import { MilestonesModule } from 'src/milestones/milestones.module';
import { ProjectUpdatesModule } from 'src/project-updates/project-updates.module';
import { InvestmentsModule } from 'src/investments/investments.module';

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
