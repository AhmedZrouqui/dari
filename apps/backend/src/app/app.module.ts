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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
    PrismaModule,
    EmailModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
