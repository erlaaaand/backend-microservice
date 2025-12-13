import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Auth Service API')
        .setDescription('Microservice Authentication Gateway')
        .setVersion('1.0')
        .addBearerAuth() // Menambahkan tombol "Authorize" (Input Token)
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
};