// indicators/database.indicator.ts
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
    constructor(@InjectConnection() private connection: Connection) {
        super();
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            await this.connection.query('SELECT 1');
            return this.getStatus(key, true);
        } catch (error) {
            throw new HealthCheckError('Database check failed', this.getStatus(key, false));
        }
    }
}