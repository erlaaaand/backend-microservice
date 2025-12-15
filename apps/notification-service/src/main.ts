import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport, RmqOptions } from '@nestjs/microservices';
import { AppModule } from './app.module'; // Pastikan path sesuai nama file module Anda

// Global Filters & Interceptors
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ValidationExceptionFilter } from './shared/filters/validation-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './shared/interceptors/timeout.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // 1. Create Hybrid Application (HTTP + Microservice capability)
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get configurations
  const port = configService.get<number>('app.port');
  const apiPrefix = configService.get<string>('app.apiPrefix');
  const rabbitmqConfig = configService.get<RmqOptions>('rabbitmq');

  // 2. Connect Microservice (RabbitMQ Consumer)
  app.connectMicroservice<MicroserviceOptions>(rabbitmqConfig);

  // 3. Global Configuration
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: configService.get('app.corsOrigins'),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Global Pipes (Validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that are not in DTO
      forbidNonWhitelisted: true, // Throw error if extra properties exist
      transform: true, // Auto transform payload to DTO instance
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Filters (Error Handling)
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(),
    new ValidationExceptionFilter(),
  );

  // Global Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(30000), // Global timeout 30s
  );

  // 4. Start Everything
  await app.startAllMicroservices(); // Start RabbitMQ consumers
  await app.listen(port); // Start HTTP server

  logger.log(`🚀 Notification Service running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`🐰 RabbitMQ Consumer connected to: ${rabbitmqConfig.options?.urls?.[0] || 'unknown'}`);
}

bootstrap();