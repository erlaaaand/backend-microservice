// timeout.decorator.ts
export function Timeout(ms: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            return Promise.race([
                originalMethod.apply(this, args),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
                ),
            ]);
        };

        return descriptor;
    };
}