// notification.metrics.ts
import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Gauge, Registry } from 'prom-client';

@Injectable()
export class NotificationMetrics {
    private readonly registry: Registry;

    // Counters
    private readonly notificationsSentTotal: Counter;
    private readonly notificationsFailedTotal: Counter;
    private readonly notificationsRetriedTotal: Counter;

    // Histograms (for latency)
    private readonly notificationDuration: Histogram;
    private readonly queueWaitTime: Histogram;

    // Gauges (for current state)
    private readonly activeNotifications: Gauge;
    private readonly queueSize: Gauge;

    constructor() {
        this.registry = new Registry();

        // Initialize counters
        this.notificationsSentTotal = new Counter({
            name: 'notifications_sent_total',
            help: 'Total number of notifications sent',
            labelNames: ['channel', 'priority', 'status'],
            registers: [this.registry],
        });

        this.notificationsFailedTotal = new Counter({
            name: 'notifications_failed_total',
            help: 'Total number of failed notifications',
            labelNames: ['channel', 'error_type'],
            registers: [this.registry],
        });

        this.notificationsRetriedTotal = new Counter({
            name: 'notifications_retried_total',
            help: 'Total number of notification retries',
            labelNames: ['channel', 'attempt'],
            registers: [this.registry],
        });

        // Initialize histograms
        this.notificationDuration = new Histogram({
            name: 'notification_duration_seconds',
            help: 'Duration of notification processing in seconds',
            labelNames: ['channel', 'status'],
            buckets: [0.1, 0.5, 1, 2, 5, 10],
            registers: [this.registry],
        });

        this.queueWaitTime = new Histogram({
            name: 'queue_wait_time_seconds',
            help: 'Time notifications spend waiting in queue',
            labelNames: ['queue_name'],
            buckets: [1, 5, 10, 30, 60, 300],
            registers: [this.registry],
        });

        // Initialize gauges
        this.activeNotifications = new Gauge({
            name: 'active_notifications',
            help: 'Current number of notifications being processed',
            registers: [this.registry],
        });

        this.queueSize = new Gauge({
            name: 'queue_size',
            help: 'Current size of notification queues',
            labelNames: ['queue_name', 'status'],
            registers: [this.registry],
        });
    }

    // Counter methods
    incrementSent(channel: string, priority: string, status: string): void {
        this.notificationsSentTotal.labels(channel, priority, status).inc();
    }

    incrementFailed(channel: string, errorType: string): void {
        this.notificationsFailedTotal.labels(channel, errorType).inc();
    }

    incrementRetried(channel: string, attempt: number): void {
        this.notificationsRetriedTotal.labels(channel, attempt.toString()).inc();
    }

    // Histogram methods
    recordDuration(channel: string, status: string, durationSeconds: number): void {
        this.notificationDuration.labels(channel, status).observe(durationSeconds);
    }

    recordQueueWaitTime(queueName: string, waitTimeSeconds: number): void {
        this.queueWaitTime.labels(queueName).observe(waitTimeSeconds);
    }

    // Gauge methods
    setActiveNotifications(count: number): void {
        this.activeNotifications.set(count);
    }

    setQueueSize(queueName: string, status: string, size: number): void {
        this.queueSize.labels(queueName, status).set(size);
    }

    // Get metrics
    async getMetrics(): Promise<string> {
        return this.registry.metrics();
    }

    getRegistry(): Registry {
        return this.registry;
    }
}