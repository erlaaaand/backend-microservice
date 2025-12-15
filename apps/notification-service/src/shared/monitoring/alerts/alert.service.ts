// alert.service.ts
import { Injectable, Logger } from '@nestjs/common';

export enum AlertSeverity {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    CRITICAL = 'critical',
}

export interface Alert {
    id: string;
    title: string;
    message: string;
    severity: AlertSeverity;
    timestamp: Date;
    metadata?: Record<string, any>;
}

@Injectable()
export class AlertService {
    private readonly logger = new Logger(AlertService.name);
    private readonly alerts: Alert[] = [];

    sendAlert(alert: Omit<Alert, 'id' | 'timestamp'>): void {
        const fullAlert: Alert = {
            ...alert,
            id: this.generateId(),
            timestamp: new Date(),
        };

        this.alerts.push(fullAlert);

        // Log alert
        this.logAlert(fullAlert);

        // TODO: Send to external alerting system (PagerDuty, Slack, etc.)
        // this.sendToSlack(fullAlert);
        // this.sendToPagerDuty(fullAlert);
    }

    private logAlert(alert: Alert): void {
        const message = `[ALERT] ${alert.severity.toUpperCase()} - ${alert.title}: ${alert.message}`;

        switch (alert.severity) {
            case AlertSeverity.CRITICAL:
            case AlertSeverity.ERROR:
                this.logger.error(message, alert.metadata);
                break;
            case AlertSeverity.WARNING:
                this.logger.warn(message, alert.metadata);
                break;
            default:
                this.logger.log(message, alert.metadata);
        }
    }

    getAlerts(severity?: AlertSeverity): Alert[] {
        if (severity) {
            return this.alerts.filter((a) => a.severity === severity);
        }
        return [...this.alerts];
    }

    clearAlerts(): void {
        this.alerts.length = 0;
        this.logger.log('All alerts cleared');
    }

    private generateId(): string {
        return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}