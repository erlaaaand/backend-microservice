// transaction.decorator.ts
export function Transactional() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const connection = this.connection;

            if (!connection) {
                return originalMethod.apply(this, args);
            }

            const queryRunner = connection.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                const result = await originalMethod.apply(this, args);
                await queryRunner.commitTransaction();
                return result;
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            } finally {
                await queryRunner.release();
            }
        };

        return descriptor;
    };
}
