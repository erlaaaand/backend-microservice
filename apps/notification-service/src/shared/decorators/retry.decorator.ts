// retry.decorator.ts
export function Retry(options: {
    attempts?: number;
    delay?: number;
    backoff?: 'fixed' | 'exponential';
}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const maxAttempts = options.attempts || 3;
        const initialDelay = options.delay || 1000;
        const backoff = options.backoff || 'exponential';

        descriptor.value = async function (...args: any[]) {
            let lastError: Error;

            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    return await originalMethod.apply(this, args);
                } catch (error) {
                    lastError = error;

                    if (attempt < maxAttempts) {
                        const delay = backoff === 'exponential'
                            ? initialDelay * Math.pow(2, attempt - 1)
                            : initialDelay;

                        await new Promise((resolve) => setTimeout(resolve, delay));
                    }
                }
            }

            throw lastError;
        };

        return descriptor;
    };
}