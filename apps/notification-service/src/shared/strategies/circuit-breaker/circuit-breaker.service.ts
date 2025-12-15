// circuit-breaker.service.ts (Manager for multiple circuit breakers)
import { Injectable } from '@nestjs/common';
import { CircuitBreaker } from './circuit-breaker';
import { CircuitBreakerConfig } from './circuit-breaker.config';

@Injectable()
export class CircuitBreakerService {
    private circuitBreakers = new Map<string, CircuitBreaker>();

    getOrCreate(
        name: string,
        config?: CircuitBreakerConfig,
    ): CircuitBreaker {
        if (!this.circuitBreakers.has(name)) {
            this.circuitBreakers.set(name, new CircuitBreaker(name, config));
        }

        return this.circuitBreakers.get(name)!;
    }

    getAllStats() {
        const stats = [];

        for (const [name, breaker] of this.circuitBreakers.entries()) {
            stats.push(breaker.getStats());
        }

        return stats;
    }

    reset(name: string): void {
        const breaker = this.circuitBreakers.get(name);
        if (breaker) {
            breaker.reset();
        }
    }

    resetAll(): void {
        for (const breaker of this.circuitBreakers.values()) {
            breaker.reset();
        }
    }
}