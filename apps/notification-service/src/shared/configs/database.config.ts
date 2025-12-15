import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
    'database',
    (): TypeOrmModuleOptions => ({
        type: 'mysql',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT, 10) || 3307,
        username: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME || 'notification_db',

        // Entities
        entities: [__dirname + '/../../**/*.orm-entity{.ts,.js}'],

        // Migrations
        migrations: [__dirname + '/../../database/migrations/*{.ts,.js}'],
        migrationsRun: process.env.NODE_ENV === 'production',

        // Sync (hanya untuk development)
        synchronize: process.env.NODE_ENV === 'development',

        // Logging
        logging: process.env.NODE_ENV === 'development' ? ['error', 'warn', 'schema'] : ['error'],

        // Connection Pool
        extra: {
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
        },

        // Timezone
        timezone: 'Z',

        // Retry
        retryAttempts: 3,
        retryDelay: 3000,
    }),
);