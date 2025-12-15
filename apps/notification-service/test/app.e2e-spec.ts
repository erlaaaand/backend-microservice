import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common'; // dari node_modules notification-service
import request from 'supertest';
import { NotificationModule } from '../src/modules/notification/notification.module';

describe('NotificationService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [NotificationModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Samakan config dengan main.ts
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET) - Should return health status', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('details');
      });
  });

  it('/notifications/send (POST) - Should fail without API Key', () => {
    return request(app.getHttpServer())
      .post('/notifications/send')
      .send({
        userId: 'test-user',
        recipient: 'test@example.com',
        type: 'email'
      })
      .expect(401);
  });

  it('/notifications/send (POST) - Should accept with valid API Key', () => {
    const apiKey = process.env.API_KEY || 'default-api-key-change-in-production';

    return request(app.getHttpServer())
      .post('/notifications/send')
      .set('x-api-key', apiKey)
      .send({
        userId: 'user-123',
        recipient: 'tester@example.com',
        subject: 'E2E Test',
        content: 'This is a test',
        priority: 'normal'
      })
      .expect(202);
  });
});