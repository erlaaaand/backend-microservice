import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  // 1. Create Hybrid Application (HTTP + Microservice)
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 2. Konfigurasi Microservice (RabbitMQ Consumer)
  // Ini agar Auth Service bisa MENERIMA pesan dari service lain
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: configService.get<string>('RABBITMQ_QUEUE'),
      queueOptions: {
        durable: true,
      },
    },
  });

  // 3. Global Settings (CORS & Validation)
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 4. Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription(
      'Microservice untuk Autentikasi, Manajemen Sesi, dan Status Online (Presence)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // 5. Jalankan Semuanya
  await app.startAllMicroservices(); // <--- PENTING: Menyalakan RabbitMQ Listener

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  logger.log(`🚀 Auth Service running on http://localhost:${port}`);
  logger.log(`📑 Swagger Docs at http://localhost:${port}/docs`);
}

bootstrap().catch((err) => {
  console.error('❌ Bootstrap failed', err);
  process.exit(1);
});
