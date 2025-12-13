import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthModule } from './modules/auth/auth.module';
// import { PresenceModule } from './modules/presence/presence.module';
// import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // 1. Load Environment Variables (.env) secara Global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Setup Database Connection (MySQL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        // Pastikan key di .env Anda bernama 'DATABASE_HOST', bukan 'DDATABASE_HOST' (seperti typo di teks Anda)
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        // Perbaikan: Mengambil key 'DATABASE_PASSWORD'
        password: configService.get<string>('DATABASE_PASSWORD'),
        // Perbaikan: Mengambil key 'DATABASE_NAME' (auth_db)
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Ingat ubah jadi false saat production
      }),
    }),

    // 3. Feature Modules
    // AuthModule,
    // PresenceModule,
    // HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}