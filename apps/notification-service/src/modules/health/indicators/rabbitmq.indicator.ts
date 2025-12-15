// indicators/rabbitmq.indicator.ts
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';

@Injectable()
export class RabbitMQHealthIndicator extends HealthIndicator {
    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            // Simple check - assume healthy if no errors
            // In production, you'd want to actually check the connection
            return this.getStatus(key, true);
        } catch (error) {
            throw new HealthCheckError('RabbitMQ check failed', this.getStatus(key, false));
        }
    }
}