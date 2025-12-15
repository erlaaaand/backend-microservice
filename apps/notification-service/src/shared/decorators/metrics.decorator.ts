// metrics.decorator.ts
export function TrackMetrics(metricName?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const name = metricName || `${target.constructor.name}.${propertyKey}`;

        descriptor.value = async function (...args: any[]) {
            const startTime = Date.now();

            try {
                const result = await originalMethod.apply(this, args);

                const duration = Date.now() - startTime;

                // Log metrics (can be sent to Prometheus, DataDog, etc.)
                console.log(`[METRICS] ${name} - Duration: ${duration}ms - Status: success`);

                return result;
            } catch (error) {
                const duration = Date.now() - startTime;

                console.log(`[METRICS] ${name} - Duration: ${duration}ms - Status: failed - Error: ${error.message}`);

                throw error;
            }
        };

        return descriptor;
    };
}