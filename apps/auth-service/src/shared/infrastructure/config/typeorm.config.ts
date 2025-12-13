import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load .env manual untuk keperluan CLI (Migration)
config();

const configService = new ConfigService();

export const getTypeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
    type: 'mysql',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: [__dirname + '/../../../**/*.orm-entity{.ts,.js}'], // Path relatif dari folder config ini
    synchronize: true, // Ubah false di production
    logging: true,
});

// DataSource khusus untuk menjalankan Migration via CLI
export const AppDataSource = new DataSource(getTypeOrmConfig(configService));