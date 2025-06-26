import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PrismaService } from './prisma/prisma.service';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import compression from 'compression';
import express from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  setupGlobalMiddlewares(app);

  app.enableShutdownHooks();

  app.use(express.json({ limit: `10mb` }));
  app.use(cookieParser());
  app.use(express.urlencoded({ limit: `10mb` }));
  app.use(
    compression({
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }

        return compression.filter(req, res);
      },
      threshold: 1024,
      level: 6,
      memLevel: 8,
    }),
  );

  await app.listen(process.env.PORT ?? 8080);
}

export function setupGlobalMiddlewares(app: INestApplication) {
  const origin =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : [];
  const corsOptions = {
    origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
    allowedHeaders: ['Authorization', 'Content-Type'], // Allowed headers
    credentials: true, // Enable credentials (cookies, authorization headers)
  };

  app.enableCors(corsOptions);

  return app
    .setGlobalPrefix('api')
    .useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    })

    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        stopAtFirstError: true,
        skipMissingProperties: false,
      }),
    );
}

void bootstrap();
