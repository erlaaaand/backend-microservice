import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';

// Indicators
import { DatabaseHealthIndicator } from './indicators/database.indicator';
import { RedisHealthIndicator } from './indicators/redis.indicator';
import { RabbitMQHealthIndicator } from './indicators/rabbitmq.indicator';
import { QueueHealthIndicator } from './indicators/queue.indicator';

// Dependencies yang hilang
import { RedisCacheAdapter } from '../notification/infrastructure/cache/redis-cache.adapter';
// Queue juga mungkin dibutuhkan oleh QueueHealthIndicator
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAMES } from '../../shared/constants/queue.constants';

@Module({
    imports: [
        TerminusModule,
        TypeOrmModule,
        // Kita perlu akses ke Queue untuk QueueHealthIndicator
        BullModule.registerQueue({ name: QUEUE_NAMES.NOTIFICATION }), 
    ],
    controllers: [HealthController],
    providers: [
        // Indicators
        DatabaseHealthIndicator,
        RedisHealthIndicator,
        RabbitMQHealthIndicator,
        QueueHealthIndicator,

        // --- SOLUSI: Tambahkan Dependency yang dibutuhkan di sini ---
        RedisCacheAdapter, 
    ],
})
export class HealthModule { }