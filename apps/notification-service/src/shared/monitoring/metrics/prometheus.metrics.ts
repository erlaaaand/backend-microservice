// prometheus.metrics.ts (Prometheus exporter)
import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Registry } from 'prom-client';

@Injectable()
export class PrometheusMetrics {
    private readonly registry: Registry;

    constructor() {
        this.registry = new Registry();

        // Collect default metrics (CPU, memory, etc.)
        collectDefaultMetrics({ register: this.registry });
    }

    getMetrics(): Promise<string> {
        return this.registry.metrics();
    }

    getContentType(): string {
        return this.registry.contentType;
    }
}