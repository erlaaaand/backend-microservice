// jaeger.tracer.ts (Distributed Tracing)
import { Injectable, Logger } from '@nestjs/common';

/**
 * Simplified distributed tracing implementation
 * For production, consider using OpenTelemetry or Jaeger SDK
 */

export interface Span {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    operationName: string;
    startTime: Date;
    endTime?: Date;
    tags: Record<string, any>;
    logs: Array<{ timestamp: Date; message: string; fields?: Record<string, any> }>;
}

@Injectable()
export class JaegerTracer {
    private readonly logger = new Logger(JaegerTracer.name);
    private activeSpans = new Map<string, Span>();

    /**
     * Start a new span
     */
    startSpan(operationName: string, parentSpanId?: string): Span {
        const span: Span = {
            traceId: this.generateTraceId(),
            spanId: this.generateSpanId(),
            parentSpanId,
            operationName,
            startTime: new Date(),
            tags: {},
            logs: [],
        };

        this.activeSpans.set(span.spanId, span);
        return span;
    }

    /**
     * Finish a span
     */
    finishSpan(spanId: string): void {
        const span = this.activeSpans.get(spanId);

        if (span) {
            span.endTime = new Date();

            // Log span for debugging (in production, send to Jaeger)
            const duration = span.endTime.getTime() - span.startTime.getTime();
            this.logger.debug(
                `Span finished: ${span.operationName} (${duration}ms)`,
                { traceId: span.traceId, spanId: span.spanId },
            );

            this.activeSpans.delete(spanId);
        }
    }

    /**
     * Add tag to span
     */
    addTag(spanId: string, key: string, value: any): void {
        const span = this.activeSpans.get(spanId);

        if (span) {
            span.tags[key] = value;
        }
    }

    /**
     * Log event in span
     */
    logEvent(spanId: string, message: string, fields?: Record<string, any>): void {
        const span = this.activeSpans.get(spanId);

        if (span) {
            span.logs.push({
                timestamp: new Date(),
                message,
                fields,
            });
        }
    }

    /**
     * Wrap async operation with tracing
     */
    async trace<T>(
        operationName: string,
        operation: (span: Span) => Promise<T>,
        parentSpanId?: string,
    ): Promise<T> {
        const span = this.startSpan(operationName, parentSpanId);

        try {
            const result = await operation(span);
            this.addTag(span.spanId, 'status', 'success');
            return result;
        } catch (error) {
            this.addTag(span.spanId, 'status', 'error');
            this.addTag(span.spanId, 'error.message', error.message);
            this.logEvent(span.spanId, 'error', { error: error.stack });
            throw error;
        } finally {
            this.finishSpan(span.spanId);
        }
    }

    private generateTraceId(): string {
        return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateSpanId(): string {
        return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}